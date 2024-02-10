import { CLIENT_ID } from "../clientId"
import { TwitchPagination } from "../types/TwitchPagination"
import fetchWithRetry from "./fetchWithRetry"

export type Stream = {
    id: string
    user_id: string
    user_login: string
    user_name: string
    game_id: string
    game_name: string
    type: string
    title: string
    viewer_count: number
    started_at: string
    thumbnail_url: string
    tag_ids: []
    tags: string[]
    is_mature: boolean
}

export type StreamsFollowedResponse = {
    data: Stream[]
    pagination: TwitchPagination
}

const getStreamsFollowed = async (
    userId: string,
    accessToken: string
): Promise<Stream[]> => {
    const streams: Stream[] = []

    let cursor: string | undefined
    do {
        const response = await fetchPage(userId, accessToken, cursor)
        streams.push(...response.data)
        cursor = response.pagination.cursor
    } while (cursor)

    return streams
}

const fetchPage = async (
    userId: string,
    accessToken: string,
    cursor?: string
): Promise<StreamsFollowedResponse> => {
    const urlSearchParams = new URLSearchParams()
    urlSearchParams.append("user_id", userId)
    if (cursor) {
        urlSearchParams.append("after", cursor)
    }

    const response = await fetchWithRetry(
        `https://api.twitch.tv/helix/streams/followed?${urlSearchParams}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Client-Id": CLIENT_ID
            }
        },
        15
    )

    if (!response.ok) {
        throw { statusText: response.statusText, status: response.status }
    }

    return await response.json()
}

export { getStreamsFollowed }
