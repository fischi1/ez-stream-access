import { initialState } from "@shared/types/State"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useAppState } from "../../state/StateContext"
import Content from "./Content"

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

describe("Content", () => {
    it("shows only a login button if the user isn't loggedin", async () => {
        vi.mocked(useAppState).mockReturnValue({
            ...initialState
        })

        render(<Content />)

        expect(await screen.findByText("Login")).toBeInstanceOf(
            HTMLButtonElement
        )
    })

    it("shows content if logged in", async () => {
        vi.mocked(useAppState).mockReturnValue({
            ...initialState,
            loggedInState: {
                accessToken: "",
                displayName: "User",
                id: "123",
                login: "user",
                profileImageUrl: "https://picsum.photos/200/300",
                status: "LOGGED_IN"
            },
            streamState: {
                lastFetchTime: new Date().toISOString(),
                quality: "480p30",
                status: "IDLE",
                streams: [
                    {
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
                    }
                ]
            }
        })

        render(<Content />)
        render(<Content />)

        expect(await screen.findByText("Teststreamer")).toBeTruthy()
    })
})
