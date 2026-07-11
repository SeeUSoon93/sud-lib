import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const readJson = (file) =>
  JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));

const packageJson = readJson("package.json");
const packageLock = readJson("package-lock.json");
const distIndex = fs.readFileSync(path.join(root, "dist", "index.js"), "utf8");

const failures = [];

if (packageJson.version !== packageLock.version) {
  failures.push(
    `package.json (${packageJson.version}) and package-lock.json (${packageLock.version}) versions differ.`
  );
}

if (packageJson.version !== packageLock.packages?.[""]?.version) {
  failures.push("The root package-lock entry does not match package.json.");
}

if (!/^\s*["']use client["'];/.test(distIndex)) {
  failures.push('dist/index.js must preserve the "use client" directive.');
}

if (packageJson.exports?.["./dist/index.css"] !== "./dist/index.css") {
  failures.push("The public CSS subpath export is missing or incorrect.");
}

if (failures.length) {
  console.error("Package integrity check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Package integrity check passed for sud-ui@${packageJson.version}.`
);
