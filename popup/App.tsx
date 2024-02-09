import "react-toastify/dist/ReactToastify.css"
import Content from "./components/content/Content"
import Toasts from "./components/toasts/Toasts"
import { StateContext } from "./state/StateContext"

const App = () => (
    <StateContext>
        <Content />
        <Toasts />
    </StateContext>
)

export default App
