import { CLIENT_ID } from ".."

type UserData = {
    id: string
    login: string
    display_name: string
    type: string
    broadcaster_type: string
    description: string
    profile_image_url: string
    offline_image_url: string
    view_count: number
    created_at: string
}

type Response = { data: UserData[] }

const getUser = async (accessToken: string): Promise<Response> => {
    const response = await fetch("https://api.twitch.tv/helix/users", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Client-Id": CLIENT_ID
        }
    })

    if (!response.ok) {
        throw new Error(`Got status ${response.status}`)
    }

    return await response.json()
}

export { getUser }
