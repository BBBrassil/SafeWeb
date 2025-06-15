import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy"

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "manifest.json",
          dest: "",
        },
      ],
    }),
  ],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        content: resolve(__dirname, "src/content.ts"),
        contextMenu: resolve(__dirname, "src/contextMenu.ts"),
        help: resolve(__dirname, "help.html"),
        options: resolve(__dirname, "options.html"),
        report: resolve(__dirname, "report.html"),
        scan: resolve(__dirname, "scan.html")
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].[hash].js",
        assetFileNames: "[name].[ext]"
      }
    }
  }
});