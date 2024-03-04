import browser from "webextension-polyfill"
import { Message } from "@shared/types/Message"
import { useAppState } from "../../state/StateContext"
import Button from "../button/Button"

type Props = {}

const Login = ({}: Props) => {
    const { loggedInState } = useAppState()

    const handleLoginClick = async () => {
        browser.runtime.sendMessage({ action: "login" } satisfies Message)
    }

    const inProgress = loggedInState.status === "IN_PROGRESS"

    return (
        <div className="flex h-48 items-center justify-center">
            <Button onClick={handleLoginClick} disabled={inProgress}>
                {inProgress ? "Logging in..." : "Login"}
            </Button>
        </div>
    )
}

export default Login
