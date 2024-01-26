import React from "react"
import browser from "webextension-polyfill"
import { StateContext } from "./state/StateContext"
import StreamList from "./components/streamList/StreamList"

const App = () => {
    const handleLoginClick = async () => {
        browser.runtime.sendMessage({ action: "login" })
    }

    return (
        <div className="bg-background px-2">
            <StateContext>
                <h1 className="text-xl">Cat Facts in the popup!</h1>
                <div>
                    <button
                        className="text-typography"
                        onClick={handleLoginClick}
                    >
                        Login
                    </button>
                </div>
                <StreamList />
            </StateContext>
        </div>
    )
}

export default App
