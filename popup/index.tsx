import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

const pluginTagId = "extension-root"
const component = document.getElementById(pluginTagId)!

ReactDOM.createRoot(component).render(
    <StrictMode>
        <App />
    </StrictMode>
)
