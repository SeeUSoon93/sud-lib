import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "public/fonts",
          dest: "fonts"
        }
      ]
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "SUD",
      fileName: "index",
      formats: ["es"]
    },
    outDir: "dist",
    sourcemap: true,
    minify: true,
    cssCodeSplit: false,
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
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
