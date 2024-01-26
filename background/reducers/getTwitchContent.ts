import {
    DispatchFunction,
    GetStateFunction,
    Stream,
    UpdateStateFunction
} from ".."
import { getStreamsFollowed } from "../api/streamsFollowed"
import { getUser } from "../api/user"

const getTwitchContent = async (
    updateState: UpdateStateFunction,
    getState: GetStateFunction,
    dispatch: DispatchFunction
) => {
    const state = getState()

    if (state.loggedInState.status !== "LOGGED_IN") {
        return
    }

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

    updateState((oldState) => ({ ...oldState, ...{ streams: streams } }))

    const streamerInfo = await getUser(
        state.loggedInState.accessToken,
        getState().streams.map((stream) => stream.login)
    )

    updateState((oldState) => {
        const newStreams = oldState.streams.map((stream) => {
            return {
                ...stream,
                profileImageUrl: streamerInfo.data.find(
                    (streamer) => streamer.login === stream.login
                )?.profile_image_url
            }
        })

        return { ...oldState, ...{ streams: newStreams } }
    })
}

export { getTwitchContent }
