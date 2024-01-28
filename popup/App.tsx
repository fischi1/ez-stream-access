import React from "react"
import Control from "./components/control/Control"
import StreamList from "./components/streamList/StreamList"
import { StateContext } from "./state/StateContext"

const App = () => {
    return (
        <StateContext>
            <div className="bg-background px-2">
                <Control />
                <StreamList />
            </div>
        </StateContext>
    )
}

export default App
