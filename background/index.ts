import browser from "webextension-polyfill"
import { startLoginFlow } from "./login"

type Message = {
    action: "login"
}

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
          }
}

// "NOT_LOGGED_IN" | "IN_PROGRESS" | "LOGGED_IN"
//

export type ResponseCallback = (stateUpdate: (oldState: State) => State) => void

const initialState: State = {
    loggedInState: { status: "NOT_LOGGED_IN" }
}

let state: State = initialState

let port: browser.Runtime.Port

async function handleMessage(
    { action, data }: Message,
    response: (data: any) => void
) {
    const handleStateUdate: ResponseCallback = (stateUpdate) => {
        state = stateUpdate(state)
        port?.postMessage({ state: state })
    }

    switch (action) {
        case "login":
            startLoginFlow(handleStateUdate)
            break
        default:
            console.error("unkown action")
    }
}

browser.runtime.onMessage.addListener((msg, sender, response) => {
    handleMessage(msg, response)
    return true
})

browser.runtime.onConnect.addListener((p) => {
    console.assert(p.name === "knockknock")
    port = p
    p.postMessage({ state: state })
})
