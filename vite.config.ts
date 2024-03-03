import { defineConfig } from "vite"

export default defineConfig({
    plugins: [],
    build: {
        outDir: "dist",
        emptyOutDir: false,
        rollupOptions: {
            input: {
                popup: new URL("./popup/index.html", import.meta.url).pathname
            },
            output: {
                entryFileNames: "[name]/[name].js",
                assetFileNames: "[name]/[name]-[hash][extname]"
            }
        },
        sourcemap: true
    }
})
