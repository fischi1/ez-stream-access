import { vi } from "vitest"

const browser = {
    storage: { local: { get: vi.fn(() => Promise.resolve()) } },
    runtime: {
        onMessage: { addListener: () => {} },
        onConnect: { addListener: () => {} },
        sendMessage: vi.fn()
    },
    tabs: { update: vi.fn(), create: vi.fn() },
    identity: {
        getRedirectURL: () => "https://chrome-redirect.com/",
        launchWebAuthFlow: (_: { url: string }) => Promise.resolve("")
    }
}

export default browser
