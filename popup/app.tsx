import React, { useEffect, useState } from "react"
import browser from "webextension-polyfill"
import { State } from "../background"

const App = () => {
    const [state, setState] = useState<State>()

    useEffect(() => {
        var port = browser.runtime.connect({ name: "knockknock" })
        port.onMessage.addListener(({ state }) => setState(state))
    }, [])

    const handleLoginClick = async () => {
        browser.runtime.sendMessage({ action: "login" })
    }

    return (
        <div className="flex flex-col gap-4 p-4 shadow-sm bg-gradient-to-r from-purple-500 to-pink-500 w-96">
            <h1>Cat Facts in the popup!</h1>
            <button
                className="px-4 py-2 font-semibold text-sm bg-green-500 text-white rounded-full shadow-sm disabled:opacity-75 w-48"
                onClick={handleLoginClick}
            >
                Login
            </button>
            <p className="text-white">{JSON.stringify(state, null, 4)}</p>
        </div>
    )
}

export default App
