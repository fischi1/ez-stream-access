#!/usr/bin/env node

import path from "node:path"
import url from "node:url"

import { remote } from "webdriverio"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

/**
 * start WebDriver session with extension installed
 */
async function startBrowser() {
    const capabilities = {
        browserName: "chrome",
        "goog:chromeOptions": {
            args: [`--load-extension=${path.join(__dirname, "..", "dist")}`]
        }
    }
    const browser = await remote({
        // logLevel: 'error',
        capabilities
    })

    await browser.url("https://lukasfischer.me")
}

console.log(`Run web extension in chromee`)
await startBrowser()
