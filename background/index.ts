import browser from "webextension-polyfill"
import { startLoginFlow } from "./actions/login"
import { getTwitchContent } from "./actions/getTwitchContent"
import handleClick from "./actions/clickHandling"
import { Quality, State } from "./types/State"
import { changeQuality } from "./actions/controls"

export const CLIENT_ID = "39df8lhu3w5wmz3ufzxf2cfz2ff0ht"

export type Message =
    | {
          action: "login"
          data: undefined
      }
    | {
          action: "logout"
          data: undefined
      }
    | {
          action: "fetchStreams"
          data: undefined
      }
    | {
          action: "click"
          data: ClickData
      }
    | {
          action: "changeQuality"
          data: Quality
      }

export type ClickData = {
    streamLogin: string
    clickedItem: "thumbnail" | "title" | "name" | "gameName" | "profileImage"
    targetBlank: boolean
}

export type UpdateStateFunction = (
    stateUpdate: (oldState: State) => State
) => void

export type DispatchFunction = (message: Message) => void

export type GetStateFunction = () => State

const initialState: State = {
    loggedInState: { status: "NOT_LOGGED_IN" },
    streamState: { status: "IDLE", streams: [], quality: "auto" }
}

let stateHolder = { state: initialState }

let port: browser.Runtime.Port

browser.storage.local.get("data").then((result) => {
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

    switch (action) {
        case "login":
            startLoginFlow(handleStateUpdate, getState, handleAction)
            break
        case "logout":
            stateHolder = { state: initialState }
            handleStateUpdate(() => {
                return stateHolder.state
            })
            break
        case "fetchStreams":
            getTwitchContent(handleStateUpdate, getState, handleAction)
            break
        case "changeQuality":
            changeQuality(data, handleStateUpdate)
            break
        case "click":
            handleClick(
                data,
                handleStateUpdate,
                getState,
                handleAction,
                closePopup
            )
        default:
            console.error("unknown action")
    }
}

browser.runtime.onMessage.addListener((msg) => {
    handleAction(msg)
    return true
})

browser.runtime.onConnect.addListener((p) => {
    console.assert(p.name === "twitch-web-extension")
    port = p
    p.postMessage({ action: "stateUpdate", state: stateHolder.state })
})
