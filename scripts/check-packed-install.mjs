import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const root = process.cwd();
const expectedVersion = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf8")
).version;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "sud-ui-pack-"));
const npmCommand = process.env.npm_execpath ? process.execPath : "npm";
const npmArgs = process.env.npm_execpath
  ? [process.env.npm_execpath]
  : [];
let tarball;

try {
  const raw = execFileSync(npmCommand, [...npmArgs, "pack", "--json", "--ignore-scripts"], {
    cwd: root,
    encoding: "utf8",
    shell: process.platform === "win32" && !process.env.npm_execpath,
    stdio: ["ignore", "pipe", "inherit"]
  });
  const [pack] = JSON.parse(raw);
  tarball = path.join(root, pack.filename);

  fs.writeFileSync(
    path.join(tempDir, "package.json"),
    JSON.stringify({ name: "sud-ui-packed-smoke", private: true, type: "module" })
  );
  execFileSync(npmCommand, [...npmArgs, "install", "--ignore-scripts", "--no-audit", "--no-fund", "--prefer-offline", tarball], {
    cwd: tempDir,
    shell: process.platform === "win32" && !process.env.npm_execpath,
    stdio: "inherit"
  });

  const requireFromConsumer = createRequire(path.join(tempDir, "package.json"));
  const entry = requireFromConsumer.resolve("sud-ui");
  const css = requireFromConsumer.resolve("sud-ui/dist/index.css");
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(entry, "..", "..", "package.json"), "utf8")
  );
  const source = fs.readFileSync(entry, "utf8");

  if (packageJson.version !== expectedVersion) {
    throw new Error(
      `Expected packed sud-ui@${expectedVersion}, received ${packageJson.version}.`
    );
  }
  if (!fs.existsSync(css)) throw new Error("Public CSS export cannot be resolved.");
  if (
    !/from\s*["']dayjs["']/.test(source) ||
    !/from\s*["']sud-icons["']/.test(source)
  ) {
    throw new Error("Packed entry does not preserve external dayjs and sud-icons imports.");
  }

  console.log(`Packed-install smoke passed: ${path.relative(root, tarball)} installed into ${tempDir}.`);
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
  if (tarball) {
    fs.rmSync(tarball, { force: true });
  }
}
