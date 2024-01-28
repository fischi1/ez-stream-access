import React from "react"
import browser from "webextension-polyfill"
import { StateContext } from "./state/StateContext"
import StreamList from "./components/streamList/StreamList"
import { Message } from "../background"
import RadioToggle from "./components/toggle/RadioToggle"

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
                <fieldset>
                    <legend>Quality</legend>
                    <RadioToggle value="1" name="quality" />
                    <RadioToggle value="2" name="quality" />
                    <RadioToggle value="3" name="quality" />
                </fieldset>
                <StreamList />
            </div>
        </StateContext>
    )
}

export default App
