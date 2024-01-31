import React from "react"
import Control from "./components/control/Control"
import StreamList from "./components/streamList/StreamList"
import { StateContext } from "./state/StateContext"
import Content from "./content/Content"

const App = () => {
    return (
        <StateContext>
            <Content />
        </StateContext>
    )
}

export default App
