import React from "react"
import { useAppState } from "../../state/StateContext"
import Control from "../control/Control"
import Login from "../login/Login"
import StreamList from "../streamList/StreamList"

type Props = {}

const Content = ({}: Props) => {
    const state = useAppState()

    return (
        <div className="bg-background">
            <Control />
            {state?.loggedInState.status === "LOGGED_IN" &&
            state.streamState.streams.length > 0 ? (
                <StreamList />
            ) : (
                <Login />
            )}
        </div>
    )
}

export default Content
