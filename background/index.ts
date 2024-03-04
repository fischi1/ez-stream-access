import browser from "webextension-polyfill"
import { State, initialState } from "../shared/types/State"
import dispatch, { DispatchFunction } from "./dispatch"

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

let contextHolder = generateContext()

export const resetContext: ResetContextFunction = (c: Context) => {
    const { setState } = c
    setState(() => {
        return initialState
    })
    c.invalidHolder.invalid = true
    contextHolder = generateContext()
}

const initializingStatePromise = browser.storage.local
    .get("data")
    .then((result) => {
        if (result?.data) {
            contextHolder.stateHolder.state = result.data
        }
    })

browser.runtime.onMessage.addListener((msg) => {
    dispatch(msg, contextHolder.context)
})

browser.runtime.onConnect.addListener(async (p) => {
    console.assert(p.name === "twitch-web-extension")
    port = p
    await initializingStatePromise
    p.postMessage({
        action: "stateUpdate",
        state: contextHolder.stateHolder.state
    })
    dispatch({ action: "refreshStreams" }, contextHolder.context)
})
