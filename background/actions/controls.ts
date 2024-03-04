import { Quality } from "@shared/types/State"
import { Context } from ".."

const changeQuality = async (newQuality: Quality, { setState }: Context) => {
    setState((oldState) => ({
        ...oldState,
        streamState: { ...oldState.streamState, quality: newQuality }
    }))
}

export { changeQuality }
