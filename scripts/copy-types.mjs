import { cp, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const srcRoot = path.join(projectRoot, "src");
const distRoot = path.join(projectRoot, "dist");

const copyDeclarations = async (currentDir) => {
  const entries = await readdir(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      await copyDeclarations(sourcePath);
      continue;
    }

    if (!entry.name.endsWith(".d.ts")) {
      continue;
    }

    const relativePath = path.relative(srcRoot, sourcePath);
    const targetPath = path.join(distRoot, relativePath);

    await mkdir(path.dirname(targetPath), { recursive: true });
    await cp(sourcePath, targetPath);
  }
};

await copyDeclarations(srcRoot);
