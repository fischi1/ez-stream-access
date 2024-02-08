import browser from "webextension-polyfill"
import dispatch, { DispatchFunction } from "./dispatch"
import { State } from "./types/State"

export const CLIENT_ID = "39df8lhu3w5wmz3ufzxf2cfz2ff0ht"

export type SetStateFunction = (stateUpdate: (oldState: State) => State) => void

export type GetStateFunction = () => State

export type ClosePopupFunction = () => void

type ResetContextFunction = (context: Context) => void

export type Context = {
    setState: SetStateFunction
    getState: GetStateFunction
    dispatch: DispatchFunction
    closePopup: ClosePopupFunction
    invalidHolder: { invalid: boolean }
}

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

let port: browser.Runtime.Port

const generateContext = (): {
    context: Context
    stateHolder: { state: State }
} => {
    const stateHolder = { state: initialState }
    const invalidHolder = { invalid: false }

    const setState: SetStateFunction = (stateUpdate) => {
        if (invalidHolder.invalid) {
            console.warn("invalid context")
            return
        }
        stateHolder.state = stateUpdate(stateHolder.state)
        port?.postMessage({ action: "stateUpdate", state: stateHolder.state })
        browser.storage.local.set({ data: stateHolder.state })
    }

    const getState: GetStateFunction = () => stateHolder.state

    const closePopup: ClosePopupFunction = () =>
        port?.postMessage({ action: "close" })

    return {
        context: {
            setState,
            getState,
            closePopup,
            dispatch,
            invalidHolder
        },
        stateHolder
    }
}

let { context, stateHolder } = generateContext()

export const resetContext: ResetContextFunction = (c: Context) => {
    const { setState } = c
    setState(() => {
        return initialState
    })
    c.invalidHolder.invalid = true
    context = generateContext().context
}

const initializingStatePromise = browser.storage.local
    .get("data")
    .then((result) => {
        if (result?.data) {
            stateHolder.state = result.data
        }
    })

browser.runtime.onMessage.addListener((msg) => {
    dispatch(msg, context)
    return true
})

browser.runtime.onConnect.addListener(async (p) => {
    console.assert(p.name === "twitch-web-extension")
    port = p
    await initializingStatePromise
    p.postMessage({ action: "stateUpdate", state: stateHolder.state })
    dispatch({ action: "refreshStreams" }, context)
})
