import { afterEach, describe, expect, it, vi } from "vitest"
import { CLIENT_ID } from "../clientId"
import { generateStream } from "../testUtils/generateStream"
import fetchWithRetry from "./fetchWithRetry"
import { StreamsFollowedResponse, getStreamsFollowed } from "./streamsFollowed"

vi.mock("./fetchWithRetry")

afterEach(() => {
    vi.clearAllMocks()
})

describe("getStreamsFollowed", () => {
    it("should return the response", async () => {
        const originalStreams = [
            generateStream("streamer1"),
            generateStream("streamer2"),
            generateStream("streamer3")
        ]

        vi.mocked(fetchWithRetry).mockReturnValue(
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
        vi.mocked(fetchWithRetry).mockReturnValue(
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

        vi.mocked(fetchWithRetry)
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
        expect(fetchWithRetry).toBeCalledTimes(3)
        expect(fetchWithRetry).toHaveBeenNthCalledWith(
            2,
            expect.stringContaining("points+to+page+2"),
            fetchOptions,
            expect.any(Number)
        )
        expect(fetchWithRetry).toHaveBeenNthCalledWith(
            3,
            expect.stringContaining("points+to+page+3"),
            fetchOptions,
            expect.any(Number)
        )
    })
})
