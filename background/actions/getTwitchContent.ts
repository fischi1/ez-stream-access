import {
    DispatchFunction,
    GetStateFunction,
    RefreshStreamsData,
    UpdateStateFunction
} from ".."
import { getStreamsFollowed } from "../api/streamsFollowed"
import { getUser } from "../api/user"
import { Stream } from "../types/State"

const getTwitchContent = async (
    updateState: UpdateStateFunction,
    getState: GetStateFunction,
    dispatch: DispatchFunction
) => {
    const state = getState()

    if (
        state.loggedInState.status !== "LOGGED_IN" ||
        state.streamState.status !== "IDLE"
    ) {
        return
    }

    updateState((oldState) => ({
        ...oldState,
        ...{ streamState: { ...oldState.streamState, status: "FETCHING" } }
    }))

    const streamData = await getStreamsFollowed(
        state.loggedInState.id,
        state.loggedInState.accessToken
    )

    var streams: Stream[] = streamData.data.map((stream) => ({
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

    updateState((oldState) => ({
        ...oldState,
        ...{ streamState: { ...oldState.streamState, streams: streams } }
    }))

    const streamerInfo = await getUser(
        state.loggedInState.accessToken,
        getState().streamState.streams.map((stream) => stream.login)
    )

    updateState((oldState) => {
        const newStreams = oldState.streamState.streams.map((stream) => {
            return {
                ...stream,
                profileImageUrl: streamerInfo.data.find(
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
}

const refreshTwitchContent = async (
    data: RefreshStreamsData | undefined,
    updateState: UpdateStateFunction,
    getState: GetStateFunction,
    dispatch: DispatchFunction
) => {
    const lastFetchDate = new Date(getState().streamState.lastFetchTime)

    if (
        data?.force ||
        new Date().getTime() - lastFetchDate.getTime() > 3 * 60 * 1000
    ) {
        getTwitchContent(updateState, getState, dispatch)
    }
}

export { getTwitchContent, refreshTwitchContent }
