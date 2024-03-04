import clsx from "clsx"
import { useEffect, useState } from "react"
import browser from "webextension-polyfill"
import { Message } from "../../../shared/types/Message"
import { useAppState } from "../../state/StateContext"
import Button from "../button/Button"
import ClickAwayOverlay from "../clickAwayOverlay/ClickAwayOverlay"

type Props = {}

const Menu = ({}: Props) => {
    const { loggedInState } = useAppState()

    const [open, setOpen] = useState(false)

    const handleLogoutClick = async () => {
        browser.runtime.sendMessage({ action: "logout" } satisfies Message)
    }

    useEffect(() => {
        if (loggedInState.status !== "LOGGED_IN") {
            setOpen(false)
        }
    }, [loggedInState.status])

    return (
        <div>
            {loggedInState.status === "LOGGED_IN" ? (
                <button onClick={() => setOpen(!open)}>
                    <img
                        src={loggedInState.profileImageUrl}
                        alt={loggedInState.displayName}
                        className="w-9 aspect-square rounded-full object-cover"
                    />
                </button>
            ) : (
                <div className="w-9 aspect-square bg-lightBackground rounded-full">
                    &nbsp;
                </div>
            )}

            <ClickAwayOverlay enabled={open} onClick={() => setOpen(false)}>
                <div
                    className={clsx(
                        "bg-menu rounded-md border border-darkBorder absolute top-[65px] right-[10px] w-[250px] p-3 justify-between z-clickAwayElement",
                        open ? "flex" : "hidden"
                    )}
                >
                    <p className="font text-lg font-bold">
                        {loggedInState.status === "LOGGED_IN"
                            ? loggedInState.displayName
                            : undefined}
                    </p>
                    <div>
                        <Button onClick={handleLogoutClick}>Logout</Button>
                    </div>
                </div>
            </ClickAwayOverlay>
        </div>
    )
}

export default Menu
