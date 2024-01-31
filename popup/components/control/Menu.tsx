import React, { useEffect, useState } from "react"
import { useAppState } from "../../state/StateContext"
import Button from "../button/Button"
import { Message } from "../../../background"
import browser from "webextension-polyfill"

type Props = {}

const Menu = ({}: Props) => {
    const { loggedInState } = useAppState()

    const [open, setOpen] = useState(true)
    
    const handleLogoutClick = async () => {
        browser.runtime.sendMessage({ action: "logout" } as Message)
    }

    useEffect(() => {
        if(loggedInState.status !== "LOGGED_IN") {
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
            {open && loggedInState.status === "LOGGED_IN" && (
                <div className="bg-menu rounded-md border border-darkBorder absolute top-[65px] right-[10px] w-[250px] p-3">
                    <p className="font text-lg font-bold">{loggedInState.displayName}</p>
                    <Button onClick={handleLogoutClick}>Logout</Button>
                </div>
            )}
        </div>
    )
}

export default Menu
