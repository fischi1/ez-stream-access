import { CLIENT_ID } from ".."

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
    tag_id: []
    tags: string[]
    is_mature: boolean
}

type Response = {
    data: Stream[]
}

const getStreamsFollowed = async (
    userId: string,
    accessToken: string
): Promise<Response> => {
    const response = await fetch(
        `https://api.twitch.tv/helix/streams/followed?user_id=${userId}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Client-Id": CLIENT_ID
            }
        }
    )

    if (!response.ok) {
        throw new Error(`Got status ${response.status}`)
    }

    return await response.json()
}

export { getStreamsFollowed }
