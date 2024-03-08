import { Message } from "@shared/types/Message"
import { initialState } from "@shared/types/State"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import browser from "../../../__mocks__/webextension-polyfill"
import { useAppState } from "../../state/StateContext"
import StreamCard from "./StreamCard"

vi.mock("../../state/StateContext")

vi.mock("webextension-polyfill")

beforeEach(() => {
    vi.mocked(useAppState).mockReturnValueOnce({
        ...initialState,
        streamState: { ...initialState.streamState, quality: "720p30" }
    })
})

afterEach(() => {
    cleanup()
    vi.clearAllMocks()
})

describe("StreamCard", () => {
    it("replaces placeholders of the thumbnail url", async () => {
        render(
            <StreamCard
                stream={{
                    displayName: "Teststreamer",
                    gameId: "game:123",
                    gameName: "Game Name",
                    login: "teststreamer",
                    profileImageUrl: "https://picsum.photos/id/237/200/200",
                    startedAt: new Date().toISOString(),
                    thumbnailUrl:
                        "https://static-cdn.jtvnw.net/previews-ttv/live_user_teststreamer-{width}x{height}.jpg",
                    title: "Stream name",
                    type: "live",
                    viewerCount: 21313
                }}
            />
        )

        expect(
            await screen.findByAltText(
                "Stream preview thumbnail of Teststreamer"
            )
        ).toHaveProperty(
            "src",
            "https://static-cdn.jtvnw.net/previews-ttv/live_user_teststreamer-400x225.jpg"
        )
    })

    it("thumbail link has correct url", async () => {
        render(
            <StreamCard
                stream={{
                    displayName: "Teststreamer",
                    gameId: "game:123",
                    gameName: "Game Name",
                    login: "teststreamer",
                    profileImageUrl: "https://picsum.photos/id/237/200/200",
                    startedAt: new Date().toISOString(),
                    thumbnailUrl:
                        "https://static-cdn.jtvnw.net/previews-ttv/live_user_teststreamer-{width}x{height}.jpg",
                    title: "Stream name",
                    type: "live",
                    viewerCount: 21313
                }}
            />
        )

        expect(
            (
                await screen.findByAltText(
                    "Stream preview thumbnail of Teststreamer"
                )
            ).parentElement
        ).toHaveProperty(
            "href",
            "https://player.twitch.tv/?channel=teststreamer&enableExtensions=true&muted=false&parent=twitch.tv&player=popout&quality=720p30&volume=1"
        )
    })

    it("triggers a click action on thumbnail click", async () => {
        render(
            <StreamCard
                stream={{
                    displayName: "Teststreamer",
                    gameId: "game:123",
                    gameName: "Game Name",
                    login: "teststreamer",
                    profileImageUrl: "https://picsum.photos/id/237/200/200",
                    startedAt: new Date().toISOString(),
                    thumbnailUrl:
                        "https://static-cdn.jtvnw.net/previews-ttv/live_user_teststreamer-{width}x{height}.jpg",
                    title: "Stream name",
                    type: "live",
                    viewerCount: 21313
                }}
            />
        )

        fireEvent.click(
            await screen.findByAltText(
                "Stream preview thumbnail of Teststreamer"
            )
        )

        expect(browser.runtime.sendMessage).toHaveBeenCalledWith({
            action: "click",
            data: {
                clickedItem: "thumbnail",
                streamLogin: "teststreamer",
                targetBlank: false
            }
        } satisfies Message)
    })

    it("triggers a click action with target=blank true on middle mouse profile image click", async () => {
        render(
            <StreamCard
                stream={{
                    displayName: "Teststreamer",
                    gameId: "game:123",
                    gameName: "Game Name",
                    login: "teststreamer",
                    profileImageUrl: "https://picsum.photos/id/237/200/200",
                    startedAt: new Date().toISOString(),
                    thumbnailUrl:
                        "https://static-cdn.jtvnw.net/previews-ttv/live_user_teststreamer-{width}x{height}.jpg",
                    title: "Stream name",
                    type: "live",
                    viewerCount: 21313
                }}
            />
        )

        fireEvent.click(await screen.findByAltText("Teststreamer"), {
            button: 1
        })

        expect(browser.runtime.sendMessage).toHaveBeenCalledWith({
            action: "click",
            data: {
                clickedItem: "profileImage",
                streamLogin: "teststreamer",
                targetBlank: true
            }
        } satisfies Message)
    })

    it("triggers a click action with target=blank true on ctrl+click on the game name", async () => {
        render(
            <StreamCard
                stream={{
                    displayName: "Teststreamer",
                    gameId: "game:123",
                    gameName: "Game Name",
                    login: "teststreamer",
                    profileImageUrl: "https://picsum.photos/id/237/200/200",
                    startedAt: new Date().toISOString(),
                    thumbnailUrl:
                        "https://static-cdn.jtvnw.net/previews-ttv/live_user_teststreamer-{width}x{height}.jpg",
                    title: "Stream name",
                    type: "live",
                    viewerCount: 21313
                }}
            />
        )

        const user = userEvent.setup()

        await user.keyboard("[ControlLeft>]")
        await user.click(await screen.findByText("Game Name"))

        expect(browser.runtime.sendMessage).toHaveBeenCalledWith({
            action: "click",
            data: {
                clickedItem: "gameName",
                streamLogin: "teststreamer",
                targetBlank: true
            }
        } satisfies Message)
    })
})
