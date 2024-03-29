import { StatusError } from "@shared/types/StatusError"
import { CLIENT_ID } from "../clientId"
import fetchWithRetry from "./fetchWithRetry"

export type UserData = {
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

export type UserResponse = { data: UserData[] }

const TWITCH_API_USER_LIMIT = 100

const getUser = async (
    accessToken: string,
    logins?: string[]
): Promise<UserData[]> => {
    if ((logins?.length ?? 0) > 0) {
        const promises = splitArrayIntoGroups(logins!).map((group) =>
            getUsersPaged(accessToken, group)
        )
        return (await Promise.all(promises)).flatMap(
            (response) => response.data
        )
    }

    return (await getUsersPaged(accessToken)).data
}

const getUsersPaged = async (
    accessToken: string,
    logins?: string[]
): Promise<UserResponse> => {
    const response = await fetchWithRetry(
        getUrl(logins),
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Client-Id": CLIENT_ID
            }
        },
        15
    )

    if (!response.ok) {
        throw {
            statusText: response.statusText,
            status: response.status
        } satisfies StatusError
    }

    return await response.json()
}

const splitArrayIntoGroups = (userIds: string[]) => {
    const result: string[][] = []
    for (let i = 0; i < userIds.length; i += TWITCH_API_USER_LIMIT) {
        result.push(userIds.slice(i, i + TWITCH_API_USER_LIMIT))
    }
    return result
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
