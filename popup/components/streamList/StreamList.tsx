import React from "react"
import { useAppState } from "../../state/StateContext"
import StreamCard from "./StreamCard"
import ArrowClockwiseIcon from "../arrowClockwiseIcon/ArrowClockwiseIcon"

type Props = {}

const StreamList = ({}: Props) => {
    const { streamState } = useAppState()

    if (streamState.streams.length === 0) {
        if (streamState.status === "FETCHING") {
            return (
                <div className="flex h-48 items-center justify-center">
                    <ArrowClockwiseIcon className="animate-spin" />
                </div>
            )
        }
        return (
            <div className="flex h-48 items-center justify-center">
                <p>You don't follow any streams</p>
            </div>
        )
    }

    return (
        <div className="flex flex-wrap justify-between gap-x-3 gap-y-5 mx-2 py-2">
            {streamState.streams.map((stream) => (
                <StreamCard key={stream.login} stream={stream} />
            ))}
            {streamState.streams.length % 2 === 1 && (
                <div className="text-left flex-[1_0_40%] self-start">
                    &nbsp;
                </div>
            )}
        </div>
    )
}

export default StreamList
