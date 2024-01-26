import {
    DispatchFunction,
    GetStateFunction,
    Stream,
    UpdateStateFunction
} from ".."
import { getStreamsFollowed } from "../api/streamsFollowed"

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
        viewerCount: stream.viewer_count
    }))

    updateState((oldState) => ({ ...oldState, ...{ streams: streams } }))
}

export { getTwitchContent }
