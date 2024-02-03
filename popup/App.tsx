import React from "react"
import Content from "./components/content/Content"
import { StateContext } from "./state/StateContext"

const App = () => {
    return (
        <StateContext>
            <Content />
        </StateContext>
    )
}

export default App
