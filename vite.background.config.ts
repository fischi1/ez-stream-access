import path from "node:path"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [],
    build: {
        emptyOutDir: false,
        outDir: path.resolve(__dirname, "dist"),
        lib: {
            formats: ["iife"],
            entry: path.resolve(__dirname, "background", "index.ts"),
            name: "EZ Stream Access Background Script"
        },
        rollupOptions: {
            output: {
                entryFileNames: "background/background.js",
                extend: true
            }
        },
        sourcemap: true,
        copyPublicDir: false
    }
})
