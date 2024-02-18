import browser from "webextension-polyfill"
import { Context } from ".."
import { CLIENT_ID } from "../clientId"
import { UserData, getUser } from "../api/user"
import { addToast } from "./toasts"

const DEBUG_CALLBACK_URL = import.meta.env.VITE_DEBUG_CALLBACK_URL

const getTwitchLoginUrl = (state: string) => {
    return `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${browser.identity.getRedirectURL()}&response_type=token&scope=user%3Aread%3Afollows&state=${state}`
}

const urlRegex = /^https:\/\/.*#(.*=.*&*)$/

const startLoginFlow = async (context: Context) => {
    const { setState, getState, dispatch } = context

    if (getState().loggedInState.status !== "NOT_LOGGED_IN") {
        return
    }

    setState((oldState) => ({
        ...oldState,
        ...{ loggedInState: { status: "IN_PROGRESS" } }
    }))

    let url: string

    const state = generateRandomString()

    try {
        if (!DEBUG_CALLBACK_URL) {
            url = await browser.identity.launchWebAuthFlow({
                url: getTwitchLoginUrl(state),
                interactive: true
            })
        } else {
            await new Promise((resolve) => setTimeout(resolve, 100))
            url = DEBUG_CALLBACK_URL
        }
    } catch (error) {
        console.error("error logging in", error)
        setState((oldState) => ({
            ...oldState,
            ...{ loggedInState: { status: "NOT_LOGGED_IN" } }
        }))
        addToast(
            { message: "There was an error logging in", type: "error" },
            context
        )
        return
    }

    if (
        !urlRegex.test(url) ||
        !url.includes("access_token=") ||
        !url.includes("state=")
    ) {
        console.error(
            "returned url didn't match the rules of a successful redirect"
        )
        setState((oldState) => ({
            ...oldState,
            ...{ loggedInState: { status: "NOT_LOGGED_IN" } }
        }))
        addToast(
            { message: "There was an error logging in", type: "error" },
            context
        )
        return
    }

    const urlSearchParams = new URLSearchParams(url.split("#")[1])

    if (state !== urlSearchParams.get("state") && !DEBUG_CALLBACK_URL) {
        console.error("state query param didn't match")
        setState((oldState) => ({
            ...oldState,
            ...{ loggedInState: { status: "NOT_LOGGED_IN" } }
        }))
        addToast(
            { message: "There was an error logging in", type: "error" },
            context
        )
        return
    }

    const accessToken = urlSearchParams.get("access_token")!

    let userData: UserData

    try {
        userData = (await getUser(accessToken))?.[0]
    } catch (error) {
        console.error("error fetching user info", error)
        setState((oldState) => ({
            ...oldState,
            ...{ loggedInState: { status: "NOT_LOGGED_IN" } }
        }))
        addToast(
            { message: "There was an error logging in", type: "error" },
            context
        )
        return
    }

    if (!userData) {
        console.error("getUser didn't return anything")
        setState((oldState) => ({
            ...oldState,
            ...{ loggedInState: { status: "NOT_LOGGED_IN" } }
        }))
        addToast(
            { message: "There was an error logging in", type: "error" },
            context
        )
        return
    }

    setState((oldState) => ({
        ...oldState,
        ...{
            loggedInState: {
                status: "LOGGED_IN",
                accessToken: accessToken,
                displayName: userData.display_name,
                login: userData.login,
                id: userData.id,
                profileImageUrl: userData.profile_image_url
            }
        }
    }))

    addToast(
        {
            message: `You are now logged in as ${userData.display_name}`,
            type: "success"
        },
        context
    )

    dispatch({ action: "fetchStreams" }, context)
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
