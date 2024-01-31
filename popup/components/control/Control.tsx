import React from "react"
import browser from "webextension-polyfill"
import { Message } from "../../../background"
import img from "../../../public/icon-72x72.png"
import Menu from "./Menu"
import QualityControls from "./QualityControls"

type Props = {}

const Control = ({}: Props) => {
    const handleRefreshClick = async () => {
        browser.runtime.sendMessage({
            action: "refreshStreams",
            data: { force: true }
        } as Message)
    }

    return (
        <>
            <div className="flex h-16 w-full bg-menu fixed top-0 z-10 border-b-darkBorder border-b-2 items-center justify-between gap-3 px-3">
                <div>
                    <img
                        src={img}
                        alt="Twitch web extension"
                        className="w-9 aspect-square rounded-full object-cover"
                    />
                </div>
                <div className="flex-grow">&nbsp;</div>
                <QualityControls />
                <div>
                    <button
                        className="hover:bg-background rounded-full p-1"
                        onClick={handleRefreshClick}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            {/* https://icons.getbootstrap.com/icons/arrow-clockwise/ */}
                            <path
                                fill-rule="evenodd"
                                d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                            />
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                        </svg>
                    </button>
                </div>
                <Menu />
            </div>
            <div className="h-16">&nbsp;</div>
        </>
    )
}

export default Control
