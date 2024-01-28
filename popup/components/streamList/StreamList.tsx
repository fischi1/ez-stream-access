import React from "react"
import { useAppState } from "../../state/StateContext"
import StreamCard from "./StreamCard"

type Props = {}

const StreamList = ({}: Props) => {
    const state = useAppState()

    if (!state) {
        return null
    }

    return (
        <div className="flex flex-wrap justify-between gap-x-3 gap-y-5">
            {state.streamState.streams.map((stream) => (
                <StreamCard key={stream.login} stream={stream} />
            ))}
            {state.streamState.streams.length % 2 === 1 && (
                <div className="text-left flex-[1_0_40%] self-start">
                    &nbsp;
                </div>
            )}
        </div>
    )
}

export default StreamList
