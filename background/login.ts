import browser from "webextension-polyfill"
import { ResponseCallback } from "."

const DEBUG_CALLBACK_URL: string | undefined =
    "https://jcalgidillanaopifkinicgeiiomeilh.chromiumapp.org/#access_token=blc0gvw617gpgkv2xnjoi1ph4fy59w&scope=user:read:follows&state=c3ab8aa609ea11e793ae92361f002671&token_type=bearer"

const getTwitchLoginUrl = () => {
    return `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=39df8lhu3w5wmz3ufzxf2cfz2ff0ht&redirect_uri=${browser.identity.getRedirectURL()}&response_type=token&scope=user%3Aread%3Afollows&state=c3ab8aa609ea11e793ae92361f002671`
}

const urlRegex = /^https:\/\/.*#(.*=.*&*)$/

const startLoginFlow = async (callback: ResponseCallback) => {
    callback((oldState) => ({
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
        callback((oldState) => ({
            ...oldState,
            ...{ loggedInState: { status: "NOT_LOGGED_IN" } }
        }))
        // TODO error
        return
    }

    const urlSearchParams = new URLSearchParams(url.split("#")[1])

    if (state !== urlSearchParams.get("state")) {
        callback((oldState) => ({
            ...oldState,
            ...{ loggedInState: { status: "NOT_LOGGED_IN" } }
        }))
        // TODO error
        return
    }

    const accessToken = urlSearchParams.get("access_token")!

    callback((oldState) => ({
        ...oldState,
        ...{ loggedInState: { status: "LOGGED_IN", accessToken: accessToken } }
    }))
}

export { startLoginFlow }
