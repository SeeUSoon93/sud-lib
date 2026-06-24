import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const srcIndex = path.join(root, "src", "index.js");
const typeIndex = path.join(root, "src", "index.d.ts");

const read = (file) => fs.readFileSync(file, "utf8");

const toPosix = (value) => value.replaceAll(path.sep, "/");

const normalizeTypeSpecifier = (specifier) =>
  specifier.replace(/\.d$/, "").replace(/^\.\//, "");

const js = read(srcIndex);
const dts = read(typeIndex);

const directJsExports = [
  ...js.matchAll(/export\s+\{([^}]+)\}\s+from\s+["'](.+?)["'];?/g)
].flatMap((match) => {
  const specifier = match[2].replace(/^\.\//, "");
  return match[1]
    .split(",")
    .map((name) => name.trim().split(/\s+as\s+/i).pop())
    .filter(Boolean)
    .map((name) => ({ name, specifier }));
});

const typeSpecifiers = [
  ...dts.matchAll(/export\s+\*\s+from\s+["'](.+?)["'];?/g)
].map((match) => normalizeTypeSpecifier(match[1]));

const missingTypeFiles = typeSpecifiers.filter((specifier) => {
  const file = path.join(root, "src", `${specifier}.d.ts`);
  return !fs.existsSync(file);
});

const missingTypeEntries = directJsExports.filter(({ specifier }) => {
  if (specifier === "index.css") return false;
  return !typeSpecifiers.includes(specifier);
});

const distFiles = ["dist/index.js", "dist/index.d.ts", "dist/index.css"];
const missingDistFiles = distFiles.filter(
  (file) => !fs.existsSync(path.join(root, file))
);

if (
  missingTypeFiles.length ||
  missingTypeEntries.length ||
  missingDistFiles.length
) {
  if (missingTypeFiles.length) {
    console.error("Missing .d.ts files referenced by src/index.d.ts:");
    for (const specifier of missingTypeFiles) {
      console.error(`- src/${toPosix(specifier)}.d.ts`);
    }
  }

  if (missingTypeEntries.length) {
    console.error("JS exports without matching type barrel entries:");
    for (const { name, specifier } of missingTypeEntries) {
      console.error(`- ${name} from src/${toPosix(specifier)}`);
    }
  }

  if (missingDistFiles.length) {
    console.error("Build output is missing:");
    for (const file of missingDistFiles) {
      console.error(`- ${file}`);
    }
  }

  process.exit(1);
}

console.log(
  `Export check passed: ${directJsExports.length} JS exports, ${typeSpecifiers.length} type barrels.`
);
