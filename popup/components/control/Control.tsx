import React from "react"
import browser from "webextension-polyfill"
import { Message } from "../../../background"
import { useAppState } from "../../state/StateContext"
import QualityControls from "./QualityControls"

type Props = {}

const Control = ({}: Props) => {
    const state = useAppState()

    const handleLoginClick = async () => {
        browser.runtime.sendMessage({ action: "login" } as Message)
    }

    const handleLogoutClick = async () => {
        browser.runtime.sendMessage({ action: "logout" } as Message)
    }

    const handleRefreshClick = async () => {
        browser.runtime.sendMessage({
            action: "refreshStreams",
            data: { force: true }
        } as Message)
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
            <div>
                <button
                    className="text-typography"
                    onClick={handleRefreshClick}
                >
                    Refresh
                </button>
            </div>
            <QualityControls />
            <pre>Status: {state?.streamState.status}</pre>
        </>
    )
}

export default Control
