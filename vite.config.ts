import { fileURLToPath } from "url"
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
    },
    resolve: {
        alias: [
            {
                find: "@shared",
                replacement: fileURLToPath(new URL("./shared", import.meta.url))
            }
        ]
    },
    define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version)
    }
})
