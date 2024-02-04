import React from "react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Content from "./components/content/Content"
import { StateContext } from "./state/StateContext"
import Toasts from "./components/toasts/Toasts"

const App = () => (
    <StateContext>
        <Content />
        <Toasts />
    </StateContext>
)

export default App
