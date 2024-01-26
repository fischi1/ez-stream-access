import React from "react"
import { Stream } from "../../../background"

type Props = {
    stream: Stream
}

const StreamCard = ({ stream }: Props) => {
    const thumbnailUrl = stream.thumbnailUrl
        .replace("{width}", "400")
        .replace("{height}", "225")

    return (
        <button className="text-left flex-[1_0_40%] self-start">
            <div className="w-full aspect-video bg-lightBackground relative">
                <img
                    src={thumbnailUrl}
                    alt={`Stream preview thumbnail of ${stream.displayName}`}
                    className="w-full h-full object-cover"
                />
                <div className="absolute left-[4px] bottom-[4px] bg-background/80 rounded px-1">
                    {stream.viewerCount}
                </div>
            </div>
            <div className="flex">
                <div className="p-2 flex-grow-0 flex-shrink-0">
                    {stream.profileImageUrl ? (
                        <img
                            src={stream.profileImageUrl}
                            alt={stream.displayName}
                            className="w-9 aspect-square bg-lightBackground rounded-full"
                        />
                    ) : (
                        <div className="w-9 aspect-square bg-lightBackground rounded-full" />
                    )}
                </div>
                <div>
                    <div className="text-base">{stream.title}</div>
                    <div>{stream.displayName}</div>
                    <div>{stream.gameName}</div>
                </div>
            </div>
        </button>
    )
}

export default StreamCard
