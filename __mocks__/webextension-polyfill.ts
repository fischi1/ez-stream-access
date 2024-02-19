import { fn } from "jest-mock"

const browser = {
    storage: { local: { get: fn(() => Promise.resolve()) } },
    runtime: {
        onMessage: { addListener: () => {} },
        onConnect: { addListener: () => {} }
    },
    tabs: { update: fn(), create: fn() }
}

export default browser
