import { Message } from "@shared/types/Message"
import browser from "webextension-polyfill"
import img from "../../../public/icon-72x72.png"
import { useAppState } from "../../state/StateContext"
import ArrowClockwiseIcon from "../arrowClockwiseIcon/ArrowClockwiseIcon"
import Menu from "./Menu"
import QualityControls from "./QualityControls"

type Props = {}

const Control = ({}: Props) => {
    const { loggedInState, streamState } = useAppState()

    const handleRefreshClick = async () => {
        browser.runtime.sendMessage({
            action: "refreshStreams",
            data: { force: true }
        } satisfies Message)
    }

    return (
        <>
            <div className="flex h-16 w-full bg-menu fixed top-0 z-10 border-b-darkBorder border-b-2 items-center justify-between gap-3 px-3">
                <img
                    src={img}
                    alt="EZ Stream Access"
                    className="h-10 aspect-square object-cover"
                />
                <div className="flex-grow">&nbsp;</div>
                <QualityControls />
                <div>
                    <button
                        className="enabled:hover:bg-background rounded-full p-1 enabled:text-typography disabled:text-slate-400"
                        onClick={handleRefreshClick}
                        disabled={
                            loggedInState.status !== "LOGGED_IN" ||
                            streamState.status === "FETCHING"
                        }
                    >
                        <ArrowClockwiseIcon
                            className={
                                streamState.status === "FETCHING"
                                    ? "animate-spin"
                                    : undefined
                            }
                        />
                    </button>
                </div>
                <Menu />
            </div>
            <div className="h-16">&nbsp;</div>
        </>
    )
}

export default Control
