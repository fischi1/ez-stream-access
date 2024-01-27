import React from "react"
import browser from "webextension-polyfill"
import { StateContext } from "./state/StateContext"
import StreamList from "./components/streamList/StreamList"
import { Message } from "../background"

const App = () => {
    const handleLoginClick = async () => {
        browser.runtime.sendMessage({ action: "login" } as Message)
    }

    const handleLogoutClick = async () => {
        browser.runtime.sendMessage({ action: "logout" } as Message)
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
                <div>
                    <button
                        className="text-typography"
                        onClick={handleLogoutClick}
                    >
                        Logout
                    </button>
                </div>
                <StreamList />
            </div>
        </StateContext>
    )
}

export default App
