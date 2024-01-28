import React from "react"
import browser from "webextension-polyfill"
import { Message } from "../../../background"
import RadioToggle from "../toggle/RadioToggle"
import { useAppState } from "../../state/StateContext"

type Props = {}

const Control = ({}: Props) => {
    const state = useAppState()

    const handleLoginClick = async () => {
        browser.runtime.sendMessage({ action: "login" } as Message)
    }

    const handleLogoutClick = async () => {
        browser.runtime.sendMessage({ action: "logout" } as Message)
    }

    return (
        <>
            <div>
                <button className="text-typography" onClick={handleLoginClick}>
                    Login
                </button>
            </div>
            <div>
                <button className="text-typography" onClick={handleLogoutClick}>
                    Logout
                </button>
            </div>
            <pre>Status: {state?.streamState.status}</pre>
            <fieldset>
                <legend>Quality</legend>
                <RadioToggle value="1" name="quality" />
                <RadioToggle value="2" name="quality" />
                <RadioToggle value="3" name="quality" />
            </fieldset>
        </>
    )
}

export default Control
