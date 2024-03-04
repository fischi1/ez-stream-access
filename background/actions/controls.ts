import { Context } from ".."
import { Quality } from "../../shared/types/State"

const changeQuality = async (newQuality: Quality, { setState }: Context) => {
    setState((oldState) => ({
        ...oldState,
        streamState: { ...oldState.streamState, quality: newQuality }
    }))
}

export { changeQuality }
