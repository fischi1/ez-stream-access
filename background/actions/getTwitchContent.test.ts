import { State, initialState } from "@shared/types/State"
import { afterEach, describe, expect, it, vi } from "vitest"
import { Context, GetStateFunction, SetStateFunction } from ".."
import { getStreamsFollowed } from "../api/streamsFollowed"
import { getUser } from "../api/user"
import { generateStream } from "../testUtils/generateStream"
import { getTwitchContent, refreshTwitchContent } from "./getTwitchContent"

vi.mock("../api/streamsFollowed")

vi.mock("../api/user")

vi.mock("./toasts")

vi.useFakeTimers()

const loggedInState = {
    status: "LOGGED_IN" as "LOGGED_IN",
    accessToken: "access-token",
    displayName: "Hello World",
    id: "1234",
    login: "hello_world",
    profileImageUrl: "https://picsum.photos/200/300"
}

afterEach(() => {
    vi.clearAllMocks()
})

describe("getTwitchContent", () => {
    it("should do nothing when not logged in", async () => {
        const getState = vi
            .fn<any, ReturnType<GetStateFunction>>()
            .mockReturnValueOnce({
                ...initialState,
                loggedInState: { status: "NOT_LOGGED_IN" }
            } as State)

        const setState = vi.fn<
            Parameters<SetStateFunction>,
            ReturnType<SetStateFunction>
        >()

        await getTwitchContent({ getState, setState } as unknown as Context)

        expect(getState).toHaveBeenCalled()
        expect(setState).not.toHaveBeenCalled()
    })

    it("should do nothing when already fetching content", async () => {
        const getState = vi
            .fn<any, ReturnType<GetStateFunction>>()
            .mockReturnValueOnce({
                ...initialState,
                streamState: { status: "FETCHING" }
            } as State)

        const setState = vi.fn<
            Parameters<SetStateFunction>,
            ReturnType<SetStateFunction>
        >()

        await getTwitchContent({ getState, setState } as unknown as Context)

        expect(getState).toHaveBeenCalled()
        expect(setState).not.toHaveBeenCalled()
    })

    it("sets status to `FETCHING` while login is in progress", async () => {
        const getState = vi
            .fn<any, ReturnType<GetStateFunction>>()
            .mockReturnValue({
                ...initialState,
                loggedInState: loggedInState
            })

        const setState = vi.fn<
            Parameters<SetStateFunction>,
            ReturnType<SetStateFunction>
        >()

        vi.mocked(getStreamsFollowed).mockReturnValue(Promise.resolve([]))

        await getTwitchContent({ getState, setState } as unknown as Context)

        const updateStateFunction = setState.mock.calls[0][0]
        expect(updateStateFunction(initialState).streamState.status).toBe(
            "FETCHING"
        )
    })

    it("should map streams to state", async () => {
        const getState = vi
            .fn<any, ReturnType<GetStateFunction>>()
            .mockReturnValue({
                ...initialState,
                loggedInState: loggedInState
            })

        const setState = vi.fn<
            Parameters<SetStateFunction>,
            ReturnType<SetStateFunction>
        >()

        vi.mocked(getStreamsFollowed).mockReturnValue(
            Promise.resolve([
                generateStream("streamer1"),
                generateStream("streamer2"),
                generateStream("streamer3")
            ])
        )

        await getTwitchContent({ getState, setState } as unknown as Context)

        const updateStateFunction = setState.mock.calls[1][0]
        expect(
            updateStateFunction(initialState).streamState.streams
        ).toHaveLength(3)
        expect(
            updateStateFunction(initialState).streamState.streams.map(
                (stream) => stream.login
            )
        ).toEqual(["streamer1", "streamer2", "streamer3"])
    })

    it("applies profile pictures to streams", async () => {
        const getState = vi
            .fn<any, ReturnType<GetStateFunction>>()
            .mockReturnValue({
                ...initialState,
                loggedInState: loggedInState
            })

        const setState = vi.fn<
            Parameters<SetStateFunction>,
            ReturnType<SetStateFunction>
        >()

        vi.mocked(getStreamsFollowed).mockReturnValue(Promise.resolve([]))
        vi.mocked(getUser).mockReturnValue(
            Promise.resolve([
                {
                    id: "12345",
                    login: "streamer2",
                    display_name: "STREAMER 2",
                    type: "",
                    broadcaster_type: "",
                    description: "hello world",
                    profile_image_url: "https://picsum.photos/200/300",
                    offline_image_url: "https://picsum.photos/200/300",
                    view_count: 1234,
                    created_at: "string"
                }
            ])
        )

        await getTwitchContent({ getState, setState } as unknown as Context)

        const updateStateFunction = setState.mock.calls[2][0]
        expect(
            updateStateFunction({
                ...initialState,
                streamState: {
                    ...initialState.streamState,
                    streams: [
                        {
                            login: "streamer2",
                            displayName: "string",
                            gameId: "string",
                            gameName: "string",
                            type: "string",
                            title: "string",
                            viewerCount: 1234,
                            startedAt: "string",
                            thumbnailUrl: "string",
                            profileImageUrl: undefined
                        }
                    ]
                }
            }).streamState.streams.map((stream) => stream.profileImageUrl)
        ).toEqual(["https://picsum.photos/200/300"])
    })

    it("updates lastFetchTime and sets status back to idle", async () => {
        const getState = vi
            .fn<any, ReturnType<GetStateFunction>>()
            .mockReturnValue({
                ...initialState,
                loggedInState: loggedInState
            })

        const setState = vi.fn<
            Parameters<SetStateFunction>,
            ReturnType<SetStateFunction>
        >()

        vi.mocked(getStreamsFollowed).mockReturnValue(Promise.resolve([]))
        vi.setSystemTime(new Date("2024-02-25T10:34:05.011Z"))
        await getTwitchContent({ getState, setState } as unknown as Context)

        const updateStateFunction = setState.mock.calls[2][0]
        expect(updateStateFunction(initialState).streamState.status).toBe(
            "IDLE"
        )
        expect(
            updateStateFunction(initialState).streamState.lastFetchTime
        ).toBe("2024-02-25T10:34:05.011Z")
    })

    it("resets status back to IDLE on error and forward the error", async () => {
        const getState = vi
            .fn<any, ReturnType<GetStateFunction>>()
            .mockReturnValue({
                ...initialState,
                ...{
                    loggedInState: loggedInState
                }
            })

        const setState = vi.fn<
            Parameters<SetStateFunction>,
            ReturnType<SetStateFunction>
        >()

        vi.mocked(getStreamsFollowed).mockRejectedValue({
            statusText: 500,
            status: "Internal Server Error"
        })

        try {
            await getTwitchContent({ getState, setState } as unknown as Context)
            throw new Error("method should forward the error")
        } catch (error) {
            expect(error).toEqual({
                statusText: 500,
                status: "Internal Server Error"
            })
        }

        expect(setState).toHaveBeenCalledTimes(2)
        const updateStateFunction = setState.mock.calls[1][0]
        expect(updateStateFunction(initialState).streamState.status).toBe(
            "IDLE"
        )
    })
})

describe("refreshTwitchContent", () => {
    it("should not do updates if data was alread fetched in the last few minutes", async () => {
        const getState = vi
            .fn<any, ReturnType<GetStateFunction>>()
            .mockReturnValue({
                ...initialState,
                streamState: {
                    lastFetchTime: "2024-02-25T10:33:05.011Z",
                    quality: "480p30",
                    status: "IDLE",
                    streams: []
                },
                loggedInState: loggedInState
            })

        const setState = vi.fn<
            Parameters<SetStateFunction>,
            ReturnType<SetStateFunction>
        >()

        vi.setSystemTime(new Date("2024-02-25T10:34:05.011Z"))

        await refreshTwitchContent({ force: false }, {
            getState,
            setState
        } as unknown as Context)

        expect(setState).not.toHaveBeenCalled()
    })

    it("should update state if the last fetch time is further than a few minutes in the past", async () => {
        const getState = vi
            .fn<any, ReturnType<GetStateFunction>>()
            .mockReturnValue({
                ...initialState,
                streamState: {
                    lastFetchTime: "2024-02-25T10:25:05.011Z",
                    quality: "480p30",
                    status: "IDLE",
                    streams: []
                },
                loggedInState: loggedInState
            })

        const setState = vi.fn<
            Parameters<SetStateFunction>,
            ReturnType<SetStateFunction>
        >()

        vi.mocked(getStreamsFollowed).mockReturnValue(Promise.resolve([]))
        vi.setSystemTime(new Date("2024-02-25T10:34:05.011Z"))

        await refreshTwitchContent({ force: false }, {
            getState,
            setState
        } as unknown as Context)

        expect(setState).toHaveBeenCalled()
    })

    it("force=true should override lastFetchtime", async () => {
        const getState = vi
            .fn<any, ReturnType<GetStateFunction>>()
            .mockReturnValue({
                ...initialState,
                streamState: {
                    lastFetchTime: "2024-02-25T10:34:05.011Z",
                    quality: "480p30",
                    status: "IDLE",
                    streams: []
                },
                loggedInState: loggedInState
            })

        const setState = vi.fn<
            Parameters<SetStateFunction>,
            ReturnType<SetStateFunction>
        >()

        vi.mocked(getStreamsFollowed).mockReturnValue(Promise.resolve([]))
        vi.setSystemTime(new Date("2024-02-25T10:34:05.011Z"))

        await refreshTwitchContent({ force: true }, {
            getState,
            setState
        } as unknown as Context)

        expect(setState).toHaveBeenCalled()
    })
})
