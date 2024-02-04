import React from "react"
import browser from "webextension-polyfill"
import Button from "../button/Button"
import { Message } from "../../../background"
import { useAppState } from "../../state/StateContext"

type Props = {}

const Login = ({}: Props) => {
    const { loggedInState } = useAppState()

    const handleLoginClick = async () => {
        browser.runtime.sendMessage({ action: "login" } as Message)
    }

    const inProgress = loggedInState.status === "IN_PROGRESS"

    return (
        <div className="flex h-48 items-center justify-center">
            <div className="h-fit">
                <Button onClick={handleLoginClick} disabled={inProgress}>
                    {inProgress ? "Logging in..." : "Login"}
                </Button>
            </div>
        </div>
    )
}

export default Login
