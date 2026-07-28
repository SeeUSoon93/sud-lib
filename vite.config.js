import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "SUD",
      fileName: "index",
      formats: ["es"]
    },
    outDir: "dist",
    // Keep source maps in the published artifact: they make production stack
    // traces actionable, while externalizing third-party packages keeps their
    // size bounded.
    sourcemap: true,
    minify: true,
    cssCodeSplit: false,
    // `public/` is only used by the local demo. Copying it into a library
    // build leaks demo assets into every npm tarball.
    publicDir: false,
    rollupOptions: {
      // These are declared package dependencies/peers and must be resolved by
      // the consuming app. Bundling them duplicates sud-icons and dayjs.
      external: ["react", "react-dom", "dayjs", "sud-icons"],
      output: {
        banner: '"use client";',
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  },
  optimizeDeps: {
    entries: ["./src/index.js"]
  }
});
