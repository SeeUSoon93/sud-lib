import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const srcIndex = path.join(root, "src", "index.js");
const typeIndex = path.join(root, "src", "index.d.ts");

const read = (file) => fs.readFileSync(file, "utf8");

const toPosix = (value) => value.replaceAll(path.sep, "/");

const sourceCandidates = (basePath) => [
  `${basePath}.js`,
  `${basePath}.jsx`,
  path.join(basePath, "index.js"),
  path.join(basePath, "index.jsx")
];

const typeCandidates = (basePath) => [
  basePath,
  `${basePath}.ts`,
  `${basePath}.d.ts`,
  path.join(basePath, "index.d.ts")
];

const resolveFromSpecifier = (fromDir, specifier, candidates) => {
  const basePath = path.resolve(fromDir, specifier);
  return candidates(basePath).find(
    (file) => fs.existsSync(file) && fs.statSync(file).isFile()
  );
};

const parseExportNames = (exportList) =>
  exportList
    .split(",")
    .map((name) => name.trim().split(/\s+as\s+/i).pop())
    .filter(Boolean);

const collectJsExports = (file, seen = new Set()) => {
  if (!file || seen.has(file)) return new Set();
  seen.add(file);

  const code = read(file);
  const dir = path.dirname(file);
  const names = new Set();

  for (const match of code.matchAll(
    /export\s+\{([^}]+)\}\s+from\s+["'](.+?)["'];?/g
  )) {
    for (const name of parseExportNames(match[1])) {
      names.add(name);
    }
  }

  for (const match of code.matchAll(
    /export\s+(?:const|function|class)\s+([A-Za-z_$][\w$]*)/g
  )) {
    names.add(match[1]);
  }

  for (const match of code.matchAll(/export\s+\*\s+from\s+["'](.+?)["'];?/g)) {
    const child = resolveFromSpecifier(dir, match[1], sourceCandidates);
    if (!child) continue;

    for (const name of collectJsExports(child, seen)) {
      names.add(name);
    }
  }

  return names;
};

const missingTypeTargets = [];

const collectTypeExports = (file, seen = new Set()) => {
  if (!file || seen.has(file)) return new Set();
  seen.add(file);

  const code = read(file);
  const dir = path.dirname(file);
  const names = new Set();

  for (const match of code.matchAll(
    /export\s+\{([^}]+)\}\s+from\s+["'](.+?)["'];?/g
  )) {
    for (const name of parseExportNames(match[1])) {
      names.add(name);
    }

    const child = resolveFromSpecifier(dir, match[2], typeCandidates);
    if (!child) {
      missingTypeTargets.push(path.resolve(dir, match[2]));
    }
  }

  for (const match of code.matchAll(
    /export\s+(?:declare\s+)?(?:const|function|class|interface|type)\s+([A-Za-z_$][\w$]*)/g
  )) {
    names.add(match[1]);
  }

  for (const match of code.matchAll(/export\s+\*\s+from\s+["'](.+?)["'];?/g)) {
    const child = resolveFromSpecifier(dir, match[1], typeCandidates);
    if (!child) {
      missingTypeTargets.push(path.resolve(dir, match[1]));
      continue;
    }

    for (const name of collectTypeExports(child, seen)) {
      names.add(name);
    }
  }

  return names;
};

const js = read(srcIndex);

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

const jsExports = collectJsExports(srcIndex);
const typeExports = collectTypeExports(typeIndex);
const missingTypeEntries = [...jsExports].filter((name) => !typeExports.has(name));

const distFiles = ["dist/index.js", "dist/index.d.ts", "dist/index.css"];
const missingDistFiles = distFiles.filter(
  (file) => !fs.existsSync(path.join(root, file))
);

if (
  missingTypeEntries.length ||
  missingTypeTargets.length ||
  missingDistFiles.length
) {
  if (missingTypeTargets.length) {
    console.error("Missing .d.ts files referenced by src/index.d.ts:");
    for (const target of [...new Set(missingTypeTargets)]) {
      console.error(`- ${toPosix(path.relative(root, target))}`);
    }
  }

  if (missingTypeEntries.length) {
    console.error("Public JS exports missing from src/index.d.ts:");
    for (const name of missingTypeEntries) {
      console.error(`- ${name}`);
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
  `Export check passed: ${jsExports.size} public JS exports, ${typeExports.size} root type exports, ${directJsExports.length} direct JS re-exports.`
);
