import browser from "webextension-polyfill"
import { Context } from ".."
import { ClickData } from "../../shared/types/Message"
import { Quality } from "../../shared/types/State"

const popupUrl = (channel: string, quality: Quality) =>
    `https://player.twitch.tv/?channel=${channel}&enableExtensions=true&muted=false&parent=twitch.tv&player=popout&quality=${quality}&volume=1`

const channelUrl = (channel: string) => `https://www.twitch.tv/${channel}`

const videosUrl = (channel: string) => `https://www.twitch.tv/${channel}/videos`

const gameUrl = (gameName: string) =>
    `https://www.twitch.tv/directory/category/${normalizeGameName(gameName)}`

const normalizeGameName = (gameName: string) => {
    return gameName
        .replace(/[^a-zA-Z0-9-]/g, " ")
        .replace(/ +/g, " ")
        .toLocaleLowerCase()
        .replace(/\s/g, "-")
}

const handleClick = (data: ClickData, { getState, closePopup }: Context) => {
    const state = getState()

    const stream = state.streamState.streams.find(
        (stream) => stream.login === data.streamLogin
    )

    if (!stream) {
        console.error(`couldn't find stream with name ${data.streamLogin}`)
        return
    }

    switch (data.clickedItem) {
        case "thumbnail":
            open(
                popupUrl(stream.login, state.streamState.quality),
                data.targetBlank
            )
            closePopup()
            break
        case "title":
        case "profileImage":
            open(channelUrl(stream.login), data.targetBlank)
            closePopup()
            break
        case "name":
            open(videosUrl(stream.login), data.targetBlank)
            closePopup()
            break
        case "gameName":
            open(gameUrl(stream.gameName), data.targetBlank)
            closePopup()
            break
    }
}

const open = (url: string, newTab: boolean) => {
    if (newTab) {
        browser.tabs.create({ url })
    } else {
        browser.tabs.update(undefined, { url })
    }
}

export { channelUrl, gameUrl, popupUrl, videosUrl }

export default handleClick
