import { expect, jest } from "@jest/globals"
import { CLIENT_ID } from "../clientId"
import fetchWithRetry from "./fetchWithRetry"
import {
    Stream,
    StreamsFollowedResponse,
    getStreamsFollowed
} from "./streamsFollowed"

jest.mock("./fetchWithRetry")
const mockedfetchWithRetry = fetchWithRetry as jest.Mocked<
    typeof fetchWithRetry
>

afterEach(() => {
    jest.clearAllMocks()
})

describe("getStreamsFollowed", () => {
    it("should return the response", async () => {
        const originalStreams = [
            generateStream("streamer1"),
            generateStream("streamer2"),
            generateStream("streamer3")
        ]

        mockedfetchWithRetry.mockReturnValue(
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve<StreamsFollowedResponse>({
                        data: originalStreams,
                        pagination: {}
                    })
            }) as Promise<Response>
        )

        const streams = await getStreamsFollowed("userId", "accessToken")

        expect(streams).toEqual(originalStreams)
    })
    it("should throw if fetch returns an error", async () => {
        mockedfetchWithRetry.mockReturnValue(
            Promise.resolve({
                ok: false,
                status: 401,
                statusText: "Unauthorized"
            }) as Promise<Response>
        )

        try {
            await getStreamsFollowed("userId", "accessToken")
        } catch (error) {
            expect(error).toEqual({ statusText: "Unauthorized", status: 401 })
        }
    })

    it("should return all pages as one array", async () => {
        const page1 = [
            generateStream("streamer1"),
            generateStream("streamer2"),
            generateStream("streamer3")
        ]
        const page2 = [
            generateStream("streamer4"),
            generateStream("streamer5"),
            generateStream("streamer6")
        ]
        const page3 = [
            generateStream("streamer7"),
            generateStream("streamer8"),
            generateStream("streamer9")
        ]

        mockedfetchWithRetry
            .mockReturnValueOnce(
                Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve<StreamsFollowedResponse>({
                            data: page1,
                            pagination: { cursor: "points to page 2" }
                        })
                }) as Promise<Response>
            )
            .mockReturnValueOnce(
                Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve<StreamsFollowedResponse>({
                            data: page2,
                            pagination: { cursor: "points to page 3" }
                        })
                }) as Promise<Response>
            )
            .mockReturnValueOnce(
                Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve<StreamsFollowedResponse>({
                            data: page3,
                            pagination: {}
                        })
                }) as Promise<Response>
            )

        const streams = await getStreamsFollowed("userId", "accessToken")

        expect(streams).toEqual([...page1, ...page2, ...page3])

        const fetchOptions = {
            headers: {
                Authorization: "Bearer accessToken",
                "Client-Id": CLIENT_ID
            }
        }
        expect(mockedfetchWithRetry).toBeCalledTimes(3)
        expect(mockedfetchWithRetry).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining("points+to+page+2"),
            fetchOptions,
            expect.any(Number)
        )
        expect(mockedfetchWithRetry).toHaveBeenNthCalledWith(
            3,
            expect.stringContaining("points+to+page+3"),
            fetchOptions,
            expect.any(Number)
        )
    })
})

const generateStream = (login: string): Stream => ({
    game_id: `game_id:${login}`,
    game_name: "The Game",
    id: `stream_id:${login}`,
    is_mature: false,
    started_at: new Date().toISOString(),
    tag_ids: [],
    tags: [],
    thumbnail_url: "https://picsum.photos/320/180",
    title: `This is the stream title of ${login}`,
    type: "live",
    user_id: `user_id:${login}`,
    user_login: login,
    user_name: login.toUpperCase(),
    viewer_count: 12347
})
