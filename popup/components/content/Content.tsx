import React from "react"
import { useAppState } from "../../state/StateContext"
import Control from "../control/Control"
import Login from "../login/Login"
import StreamList from "../streamList/StreamList"

type Props = {}

const Content = ({}: Props) => {
    const { loggedInState } = useAppState()

    return (
        <div className="bg-background">
            <Control />
            {loggedInState.status === "LOGGED_IN" ? <StreamList /> : <Login />}
        </div>
    )
}

export default Content
