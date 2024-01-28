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

const getUser = async (
    accessToken: string,
    logins?: string[]
): Promise<Response> => {
    const response = await fetch(getUrl(logins), {
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

const getUrl = (logins: string[] | undefined) => {
    const url = "https://api.twitch.tv/helix/users"

    if (logins && logins.length > 0) {
        const urlSearchParams = new URLSearchParams()
        logins.forEach((login) => urlSearchParams.append("login", login))

        return `${url}?${urlSearchParams}`
    }

    return url
}

export { getUser }