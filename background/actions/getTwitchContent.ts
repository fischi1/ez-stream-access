import { RefreshStreamsData } from "@shared/types/Message"
import { Stream } from "@shared/types/State"
import { Context } from ".."
import { getStreamsFollowed } from "../api/streamsFollowed"
import { getUser } from "../api/user"
import { addToast } from "./toasts"

const getTwitchContent = async (context: Context) => {
    const { setState, getState } = context
    try {
        const state = getState()

        if (
            state.loggedInState.status !== "LOGGED_IN" ||
            state.streamState.status !== "IDLE"
        ) {
            return
        }

        setState((oldState) => ({
            ...oldState,
            ...{ streamState: { ...oldState.streamState, status: "FETCHING" } }
        }))

        const streamData = await getStreamsFollowed(
            state.loggedInState.id,
            state.loggedInState.accessToken
        )

        const streams: Stream[] = streamData.map((stream) => ({
            displayName: stream.user_name,
            gameId: stream.game_id,
            gameName: stream.game_name,
            login: stream.user_login,
            startedAt: stream.started_at,
            thumbnailUrl: stream.thumbnail_url,
            title: stream.title,
            type: stream.type,
            viewerCount: stream.viewer_count,
            profileImageUrl: undefined
        }))

        setState((oldState) => ({
            ...oldState,
            ...{ streamState: { ...oldState.streamState, streams: streams } }
        }))

        const streamerInfos = await getUser(
            state.loggedInState.accessToken,
            getState().streamState.streams.map((stream) => stream.login)
        )

        setState((oldState) => {
            const newStreams = oldState.streamState.streams.map((stream) => {
                return {
                    ...stream,
                    profileImageUrl: streamerInfos.find(
                        (streamer) => streamer.login === stream.login
                    )?.profile_image_url
                }
            })

            return {
                ...oldState,
                ...{
                    streamState: {
                        ...oldState.streamState,
                        streams: newStreams,
                        status: "IDLE",
                        lastFetchTime: new Date().toISOString()
                    }
                }
            }
        })
    } catch (error) {
        setState((oldState) => {
            return {
                ...oldState,
                ...{
                    streamState: {
                        ...oldState.streamState,
                        status: "IDLE"
                    }
                }
            }
        })
        addToast(
            {
                message: "There was error fetching content from the Twitch API",
                type: "error"
            },
            context
        )
        throw error
    }
}

const refreshTwitchContent = async (
    data: RefreshStreamsData | undefined,
    context: Context
) => {
    const { getState } = context
    const lastFetchDate = new Date(getState().streamState.lastFetchTime)

    if (
        data?.force ||
        new Date().getTime() - lastFetchDate.getTime() > 3 * 60 * 1000
    ) {
        await getTwitchContent(context)
    }
}

export { getTwitchContent, refreshTwitchContent }
