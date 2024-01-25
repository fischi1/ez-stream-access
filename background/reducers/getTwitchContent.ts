import { DispatchFunction, GetStateFunction, UpdateStateFunction } from ".."
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

    const streamData = getStreamsFollowed("1", state.loggedInState.accessToken)
}

export { getTwitchContent }
