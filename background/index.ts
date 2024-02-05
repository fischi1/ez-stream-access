import browser from "webextension-polyfill"
import handleClick from "./actions/clickHandling"
import { changeQuality } from "./actions/controls"
import {
    getTwitchContent,
    refreshTwitchContent
} from "./actions/getTwitchContent"
import { startLoginFlow } from "./actions/login"
import { Quality, State } from "./types/State"
import { addToast, clearToasts } from "./actions/toasts"
import { StatusError } from "./types/StatusError"

export const CLIENT_ID = "39df8lhu3w5wmz3ufzxf2cfz2ff0ht"

export type Message =
    | {
          action: "login"
          data?: undefined
      }
    | {
          action: "logout"
          data?: undefined
      }
    | {
          action: "fetchStreams"
          data?: undefined
      }
    | {
          action: "refreshStreams"
          data?: RefreshStreamsData
      }
    | {
          action: "click"
          data: ClickData
      }
    | {
          action: "changeQuality"
          data: Quality
      }
    | {
          action: "clearToasts"
          data?: undefined
      }

export type ClickData = {
    streamLogin: string
    clickedItem: "thumbnail" | "title" | "name" | "gameName" | "profileImage"
    targetBlank: boolean
}

export type RefreshStreamsData = {
    force?: boolean
}

export type UpdateStateFunction = (
    stateUpdate: (oldState: State) => State
) => void

export type DispatchFunction = (message: Message) => void

export type GetStateFunction = () => State

export const initialState: State = {
    loggedInState: { status: "NOT_LOGGED_IN" },
    streamState: {
        status: "IDLE",
        streams: [],
        quality: "auto",
        lastFetchTime: new Date(0).toISOString()
    },
    toasts: []
}

let stateHolder = { state: initialState }

let port: browser.Runtime.Port

const initializingStatePromise = browser.storage.local
    .get("data")
    .then((result) => {
        if (result?.data) {
            stateHolder.state = result.data
        }
    })

const handleAction: DispatchFunction = async ({ action, data }: Message) => {
    const handleStateUpdate: UpdateStateFunction = (stateUpdate) => {
        stateHolder.state = stateUpdate(stateHolder.state)
        port?.postMessage({ action: "stateUpdate", state: stateHolder.state })
        browser.storage.local.set({ data: stateHolder.state })
    }

    const getState: GetStateFunction = () => stateHolder.state

    const closePopup = () => port?.postMessage({ action: "close" })

    try {
        switch (action) {
            case "login":
                await startLoginFlow(handleStateUpdate, getState, handleAction)
                break
            case "logout":
                await logout(handleStateUpdate)
                break
            case "fetchStreams":
                await getTwitchContent(
                    handleStateUpdate,
                    getState,
                    handleAction
                )
                break
            case "refreshStreams":
                await refreshTwitchContent(
                    data,
                    handleStateUpdate,
                    getState,
                    handleAction
                )
                break
            case "changeQuality":
                await changeQuality(data, handleStateUpdate)
                break
            case "click":
                await handleClick(
                    data,
                    handleStateUpdate,
                    getState,
                    handleAction,
                    closePopup
                )
                break
            case "clearToasts":
                await clearToasts(handleStateUpdate)
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
                handleStateUpdate
            )
            logout(handleStateUpdate)
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

const logout = (handleStateUpdate: UpdateStateFunction) => {
    stateHolder = { state: initialState }
    handleStateUpdate(() => {
        return stateHolder.state
    })
}

browser.runtime.onMessage.addListener((msg) => {
    handleAction(msg)
    return true
})

browser.runtime.onConnect.addListener(async (p) => {
    console.assert(p.name === "twitch-web-extension")
    port = p
    await initializingStatePromise
    p.postMessage({ action: "stateUpdate", state: stateHolder.state })
    handleAction({ action: "refreshStreams" })
})
