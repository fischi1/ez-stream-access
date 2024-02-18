import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState
} from "react"
import browser from "webextension-polyfill"
import { initialState } from "../../background"
import { State } from "../../background/types/State"

type Props = { children: ReactNode }

const context = createContext<State>(initialState)

const StateContext = ({ children }: Props) => {
    const [state, setState] = useState<State>(initialState)

    useEffect(() => {
        let port: browser.Runtime.Port

        const connectPort = () => {
            port = browser.runtime.connect({ name: "twitch-web-extension" })
            console.log("port connected")

            port.onMessage.addListener(({ action, state }) => {
                switch (action) {
                    case "stateUpdate":
                        setState(state)
                        break
                    case "close":
                        window.close()
                        break
                }
            })

            port.onDisconnect.addListener(() => {
                console.log("port disconnected")
                port = connectPort()
            })

            return port
        }

        port = connectPort()

        return () => {
            port.disconnect()
        }
    }, [])

    return <context.Provider value={state}>{children}</context.Provider>
}

const useAppState = () => {
    return useContext(context)
}

export { StateContext, useAppState }
