import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const npmCommand = process.env.npm_execpath ? process.execPath : "npm";
const npmArgs = process.env.npm_execpath
  ? [process.env.npm_execpath]
  : [];
const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), "sud-ui-npm-cache-"));

try {
  const raw = execFileSync(npmCommand, [
    ...npmArgs,
    "pack",
    "--json",
    "--dry-run",
    "--ignore-scripts",
    "--cache",
    cacheDir
  ], {
  cwd: root,
  encoding: "utf8",
  shell: process.platform === "win32" && !process.env.npm_execpath,
  stdio: ["ignore", "pipe", "inherit"]
  });
  const [pack] = JSON.parse(raw);
  const files = new Set(pack.files.map(({ path: file }) => file));
  const failures = [];

  const requiredFiles = [
    "package.json",
    "README.md",
    "LICENSE",
    "CHANGELOG.md",
    "dist/index.js",
    "dist/index.d.ts",
    "dist/index.css",
    "dist/index.js.map",
    "docs/surface-guidelines.md"
  ];

  const forbiddenFiles = [
    "docs/improvement-plan.md",
    "public/",
    "demo/",
    "old_index.css"
  ];

  for (const file of requiredFiles) {
    if (!files.has(file)) failures.push(`Required packed file is missing: ${file}`);
  }

  for (const prefix of forbiddenFiles) {
    if ([...files].some((file) => file === prefix || file.startsWith(prefix))) {
      failures.push(`Unexpected packed file matches: ${prefix}`);
    }
  }

  // Source maps remain intentionally included for consumer debugging. Keep a
  // ceiling high enough for that map, but low enough to catch a bundled icon
  // package or copied demo assets.
  const maxUnpackedSize = 1_400_000;
  if (pack.unpackedSize > maxUnpackedSize) {
    failures.push(
      `Packed contents are ${pack.unpackedSize} bytes; limit is ${maxUnpackedSize} bytes.`
    );
  }

  if (failures.length) {
    console.error("Package content check failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log(
      `Package content check passed: ${pack.filename} (${pack.size} bytes packed, ${pack.unpackedSize} bytes unpacked, ${files.size} files).`
    );
  }
} finally {
  fs.rmSync(cacheDir, { recursive: true, force: true });
}
