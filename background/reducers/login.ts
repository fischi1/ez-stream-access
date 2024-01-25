import browser from "webextension-polyfill"
import { DispatchFunction, GetStateFunction, UpdateStateFunction } from ".."
import { getUser } from "../api/user"

const DEBUG_CALLBACK_URL: string | undefined =
    "https://jcalgidillanaopifkinicgeiiomeilh.chromiumapp.org/#access_token=blc0gvw617gpgkv2xnjoi1ph4fy59w&scope=user:read:follows&state=c3ab8aa609ea11e793ae92361f002671&token_type=bearer"

const getTwitchLoginUrl = () => {
    return `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=39df8lhu3w5wmz3ufzxf2cfz2ff0ht&redirect_uri=${browser.identity.getRedirectURL()}&response_type=token&scope=user%3Aread%3Afollows&state=c3ab8aa609ea11e793ae92361f002671`
}

const urlRegex = /^https:\/\/.*#(.*=.*&*)$/

const startLoginFlow = async (
    updateState: UpdateStateFunction,
    getState: GetStateFunction,
    dispatch: DispatchFunction
) => {
    updateState((oldState) => ({
        ...oldState,
        ...{ loggedInState: { status: "IN_PROGRESS" } }
    }))

    let url: string

    const state = "c3ab8aa609ea11e793ae92361f002671"

    if (!DEBUG_CALLBACK_URL) {
        url = await browser.identity.launchWebAuthFlow({
            url: getTwitchLoginUrl(),
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

    if (state !== urlSearchParams.get("state")) {
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

    dispatch({ action: "fetchStreams" })
}

export { startLoginFlow }
