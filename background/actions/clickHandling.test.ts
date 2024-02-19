import { expect, it, jest } from "@jest/globals"
import { Context, initialState } from ".."
import browser from "../../__mocks__/webextension-polyfill"
import { Quality, State, Stream } from "../types/State"
import handleClick, {
    channelUrl,
    gameUrl,
    popupUrl,
    videosUrl
} from "./clickHandling"

beforeEach(() => {})

afterEach(() => {
    jest.clearAllMocks()
})

const stream: Stream = {
    displayName: "Hello Streamer",
    login: "hello-streamer",
    gameId: "1234",
    gameName: "Helldivers 2",
    profileImageUrl: "https://picsum.photos/200",
    startedAt: new Date().toISOString(),
    thumbnailUrl: "https://picsum.photos/200",
    title: "Hello Viewers",
    type: "partner",
    viewerCount: 123123
}

describe("url functions", () => {
    it("popupUrl should contain arguments", async () => {
        const channelName = "hello-world"
        const quality: Quality = "720p60"

        const url = popupUrl(channelName, quality)
        expect(url).toContain(channelName)
        expect(url).toContain(quality)
    })

    it("channelUrl should contain arguments", async () => {
        const channelName = "hello-world"

        const url = channelUrl(channelName)
        expect(url).toContain(channelName)
    })

    it("videosUrl should contain arguments", async () => {
        const channelName = "hello-world"

        const url = videosUrl(channelName)
        expect(url).toContain(channelName)
    })

    it.each([
        ["Tomb Raider I•II•III Remastered", "tomb-raider-i-ii-iii-remastered"],
        ["Software and Game Development", "software-and-game-development"],
        ["Plants vs. Zombies", "plants-vs-zombies"],
        ["Helldivers 2", "helldivers-2"],
        ["Half-Life", "half-life"],
        ["Timespinner", "timespinner"]
    ])("gameUrl should contain the normalized slug", (name, slug) => {
        const url = gameUrl(name)
        expect(url).toContain(slug)
    })
})

describe("handleClick", () => {
    it("updates the url of the current tab on normal click", () => {
        handleClick(
            {
                clickedItem: "thumbnail",
                streamLogin: "hello-streamer",
                targetBlank: false
            },
            {
                getState: () =>
                    ({
                        ...initialState,
                        ...{
                            streamState: {
                                streams: [stream],
                                quality: "480p30"
                            }
                        }
                    } as State),
                closePopup: () => {}
            } as unknown as Context
        )

        expect(browser.tabs.update).toHaveBeenCalledWith(undefined, {
            url: popupUrl("hello-streamer", "480p30")
        })
    })

    it("opens a new tab if if called with targetBlank=true", () => {
        handleClick(
            {
                clickedItem: "thumbnail",
                streamLogin: "hello-streamer",
                targetBlank: true
            },
            {
                getState: () =>
                    ({
                        ...initialState,
                        ...{
                            streamState: {
                                streams: [stream],
                                quality: "480p30"
                            }
                        }
                    } as State),
                closePopup: () => {}
            } as unknown as Context
        )

        expect(browser.tabs.create).toHaveBeenCalledWith({
            url: popupUrl("hello-streamer", "480p30")
        })
    })

    it("calls the closePopup function after opening handling the click", () => {
        const closePopupMock = jest.fn()

        handleClick(
            {
                clickedItem: "thumbnail",
                streamLogin: "hello-streamer",
                targetBlank: true
            },
            {
                getState: () =>
                    ({
                        ...initialState,
                        ...{
                            streamState: {
                                streams: [stream],
                                quality: "480p30"
                            }
                        }
                    } as State),
                closePopup: closePopupMock
            } as unknown as Context
        )

        expect(closePopupMock).toHaveBeenCalled()
    })

    it("logs an error if the login doesn't exist", () => {
        const consoleSpy = jest.spyOn(console, "error")

        handleClick(
            {
                clickedItem: "thumbnail",
                streamLogin: "hello-world",
                targetBlank: false
            },
            { getState: () => initialState } as unknown as Context
        )

        expect(consoleSpy).toHaveBeenCalledWith(
            "couldn't find stream with name hello-world"
        )
    })
})
