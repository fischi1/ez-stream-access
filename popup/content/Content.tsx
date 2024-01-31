import React from "react"
import Control from "../components/control/Control"
import Login from "../components/login/Login"
import StreamList from "../components/streamList/StreamList"
import { useAppState } from "../state/StateContext"

type Props = {}

const Content = ({}: Props) => {
    const state = useAppState()

    return (
        <div className="bg-background">
            <Control />
            {state?.loggedInState.status === "LOGGED_IN" &&
                state.streamState.streams.length > 0 ? <StreamList /> : <Login />}
        </div>
    )
}

export default Content
