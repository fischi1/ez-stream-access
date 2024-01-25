import browser from "webextension-polyfill"
import { startLoginFlow } from "./reducers/login"
import { getTwitchContent } from "./reducers/getTwitchContent"

export const CLIENT_ID = "39df8lhu3w5wmz3ufzxf2cfz2ff0ht"

/**
 * action and data
 */
type Message =
    | {
          action: "login"
      }
    | { action: "fetchStreams" }

export type State = {
    loggedInState:
        | {
              status: "NOT_LOGGED_IN"
          }
        | {
              status: "IN_PROGRESS"
          }
        | {
              status: "LOGGED_IN"
              accessToken: string
              login: string
              displayName: string
              id: string
              profileImageUrl: string
          }
}

export type UpdateStateFunction = (
    stateUpdate: (oldState: State) => State
) => void

export type DispatchFunction = (message: Message) => void

export type GetStateFunction = () => State

const initialState: State = {
    loggedInState: { status: "NOT_LOGGED_IN" }
}

let stateHolder = { state: initialState }

let port: browser.Runtime.Port

const handleAction: DispatchFunction = async ({ action }: Message) => {
    const handleStateUpdate: UpdateStateFunction = (stateUpdate) => {
        stateHolder.state = stateUpdate(stateHolder.state)
        port?.postMessage({ state: stateHolder.state })
    }

    const getState: GetStateFunction = () => stateHolder.state

    switch (action) {
        case "login":
            startLoginFlow(handleStateUpdate, getState, handleAction)
            break
        case "fetchStreams":
            getTwitchContent(handleStateUpdate, getState, handleAction)
            break
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
    p.postMessage({ state: stateHolder.state })
})
