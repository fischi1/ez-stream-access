import { Message } from "@shared/types/Message"
import { Stream } from "@shared/types/State"
import React from "react"
import browser from "webextension-polyfill"
import {
    channelUrl,
    gameUrl,
    popupUrl,
    videosUrl
} from "../../../background/actions/clickHandling"
import { useAppState } from "../../state/StateContext"

type Props = {
    stream: Stream
}

const StreamCard = ({ stream }: Props) => {
    const { streamState } = useAppState()

    const thumbnailUrl = stream.thumbnailUrl
        .replace("{width}", "400")
        .replace("{height}", "225")

    const handleClick = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        clickedItem:
            | "thumbnail"
            | "title"
            | "name"
            | "gameName"
            | "profileImage"
    ) => {
        if (e.button > 1) {
            return
        }
        e.preventDefault()
        const isNewTab = e.getModifierState("Control") || e.button === 1

        const message: Message = {
            action: "click",
            data: {
                clickedItem: clickedItem,
                streamLogin: stream.login,
                targetBlank: isNewTab
            }
        }
        browser.runtime.sendMessage(message)
    }

    return (
        <div className="text-left flex-[1_0_40%] self-start">
            <a
                href={popupUrl(stream.login, streamState.quality)}
                onClick={(e) => handleClick(e, "thumbnail")}
                onAuxClick={(e) => handleClick(e, "thumbnail")}
                className="block w-full aspect-video bg-lightBackground relative"
            >
                <img
                    src={thumbnailUrl}
                    alt={`Stream preview thumbnail of ${stream.displayName}`}
                    className="w-full h-full object-cover"
                />
                <div className="absolute left-[4px] bottom-[4px] bg-background/80 rounded px-1">
                    {stream.viewerCount}
                </div>
            </a>
            <div className="flex items-start mt-1">
                <a
                    href={channelUrl(stream.login)}
                    onClick={(e) => handleClick(e, "profileImage")}
                    onAuxClick={(e) => handleClick(e, "profileImage")}
                    className="block p-2 flex-grow-0 flex-shrink-0"
                >
                    {stream.profileImageUrl ? (
                        <img
                            src={stream.profileImageUrl}
                            alt={stream.displayName}
                            className="w-9 aspect-square rounded-full"
                        />
                    ) : (
                        <div className="w-9 aspect-square bg-lightBackground rounded-full" />
                    )}
                </a>
                <div>
                    <a
                        href={channelUrl(stream.login)}
                        onClick={(e) => handleClick(e, "title")}
                        onAuxClick={(e) => handleClick(e, "title")}
                        className="text-base block break-anywhere"
                    >
                        {stream.title}
                    </a>
                    <a
                        href={videosUrl(stream.login)}
                        onClick={(e) => handleClick(e, "name")}
                        onAuxClick={(e) => handleClick(e, "name")}
                        className="block break-anywhere"
                    >
                        {stream.displayName}
                    </a>
                    <a
                        href={gameUrl(stream.gameName)}
                        onClick={(e) => handleClick(e, "gameName")}
                        onAuxClick={(e) => handleClick(e, "gameName")}
                        className="block break-anywhere"
                    >
                        {stream.gameName}
                    </a>
                </div>
            </div>
        </div>
    )
}

export default StreamCard
