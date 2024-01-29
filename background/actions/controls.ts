import { UpdateStateFunction } from ".."
import { Quality } from "../types/State"

const changeQuality = async (
    newQuality: Quality,
    updateState: UpdateStateFunction
) => {
    updateState((oldState) => ({
        ...oldState,
        streamState: { ...oldState.streamState, quality: newQuality }
    }))
}

export { changeQuality }

