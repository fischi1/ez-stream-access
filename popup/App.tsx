import React from "react"
import browser from "webextension-polyfill"
import { StateContext } from "./state/StateContext"
import StreamList from "./components/streamList/StreamList"

const App = () => {
    const handleLoginClick = async () => {
        browser.runtime.sendMessage({ action: "login" })
    }

    return (
        <StateContext>
            <div className="bg-background px-2">
                <div>
                    <button
                        className="text-typography"
                        onClick={handleLoginClick}
                    >
                        Login
                    </button>
                </div>
                <StreamList />
            </div>
        </StateContext>
    )
}

export default App
