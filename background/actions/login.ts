import browser from "webextension-polyfill"
import {
    CLIENT_ID,
    DispatchFunction,
    GetStateFunction,
    UpdateStateFunction
} from ".."
import { getUser } from "../api/user"
import { addToast } from "./toasts"

const DEBUG_CALLBACK_URL = import.meta.env.VITE_DEBUG_CALLBACK_URL

const getTwitchLoginUrl = (state: string) => {
    return `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${browser.identity.getRedirectURL()}&response_type=token&scope=user%3Aread%3Afollows&state=${state}`
}

const urlRegex = /^https:\/\/.*#(.*=.*&*)$/

const startLoginFlow = async (
    updateState: UpdateStateFunction,
    getState: GetStateFunction,
    dispatch: DispatchFunction
) => {
    if (getState().loggedInState.status !== "NOT_LOGGED_IN") {
        return
    }

    updateState((oldState) => ({
        ...oldState,
        ...{ loggedInState: { status: "IN_PROGRESS" } }
    }))

    let url: string

    const state = generateRandomString()

    if (!DEBUG_CALLBACK_URL) {
        url = await browser.identity.launchWebAuthFlow({
            url: getTwitchLoginUrl(state),
            interactive: true
        })
    } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        url = DEBUG_CALLBACK_URL
    }

    if (
        !urlRegex.test(url) ||
        !url.includes("access_token=") ||
        !url.includes("state=")
    ) {
        updateState((oldState) => ({
            ...oldState,
            ...{ loggedInState: { status: "NOT_LOGGED_IN" } }
        }))
        // TODO error
        return
    }

    const urlSearchParams = new URLSearchParams(url.split("#")[1])

    if (state !== urlSearchParams.get("state") && !DEBUG_CALLBACK_URL) {
        updateState((oldState) => ({
            ...oldState,
            ...{ loggedInState: { status: "NOT_LOGGED_IN" } }
        }))
        // TODO error
        return
    }

    const accessToken = urlSearchParams.get("access_token")!

    const userData = await getUser(accessToken)

    const loggedInUser = userData.data?.[0]

    if (!loggedInUser) {
        updateState((oldState) => ({
            ...oldState,
            ...{ loggedInState: { status: "NOT_LOGGED_IN" } }
        }))
        // TODO error
        return
    }

    updateState((oldState) => ({
        ...oldState,
        ...{
            loggedInState: {
                status: "LOGGED_IN",
                accessToken: accessToken,
                displayName: loggedInUser.display_name,
                login: loggedInUser.login,
                id: loggedInUser.id,
                profileImageUrl: loggedInUser.profile_image_url
            }
        }
    }))

    addToast(
        {
            message: `You are now logged in as ${loggedInUser.display_name}`,
            type: "success"
        },
        updateState
    )

    dispatch({ action: "fetchStreams" })
}

const generateRandomString = () => {
    const charArr = (Math.random() + new Date().toISOString()).split("")
    // https://stackoverflow.com/a/12646864
    for (let i = charArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[charArr[i], charArr[j]] = [charArr[j], charArr[i]]
    }
    return btoa(charArr.join(""))
}

export { startLoginFlow }
