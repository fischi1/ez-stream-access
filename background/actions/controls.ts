import { Context } from ".."
import { Quality } from "../types/State"

const changeQuality = async (newQuality: Quality, { setState }: Context) => {
    setState((oldState) => ({
        ...oldState,
        streamState: { ...oldState.streamState, quality: newQuality }
    }))
}

export { changeQuality }
