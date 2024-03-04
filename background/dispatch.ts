import { Message } from "@shared/types/Message"
import { StatusError } from "@shared/types/StatusError"
import { Context, resetContext } from "."
import handleClick from "./actions/clickHandling"
import { changeQuality } from "./actions/controls"
import {
    getTwitchContent,
    refreshTwitchContent
} from "./actions/getTwitchContent"
import { startLoginFlow } from "./actions/login"
import { addToast, clearToasts } from "./actions/toasts"

export type DispatchFunction = (
    message: Message,
    context: Context
) => Promise<void>

const dispatch: DispatchFunction = async (
    { action, data }: Message,
    context: Context
) => {
    try {
        switch (action) {
            case "login":
                await startLoginFlow(context)
                break
            case "logout":
                resetContext(context)
                break
            case "fetchStreams":
                await getTwitchContent(context)
                break
            case "refreshStreams":
                await refreshTwitchContent(data, context)
                break
            case "changeQuality":
                await changeQuality(data, context)
                break
            case "click":
                await handleClick(data, context)
                break
            case "clearToasts":
                await clearToasts(context)
                break
            default:
                console.error("unknown action " + action)
        }
    } catch (error) {
        if (isStatusError(error) && error.status === 401) {
            addToast(
                {
                    message: "Login no longer valid. You need to login again.",
                    type: "error"
                },
                context
            )
            resetContext(context)
        } else {
            console.error("error", error)
        }
    }
}

const isStatusError = (error: any): error is StatusError => {
    return (
        typeof error.status === "number" && typeof error.statusText === "string"
    )
}

export default dispatch
