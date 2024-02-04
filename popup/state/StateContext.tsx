import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState
} from "react"
import browser from "webextension-polyfill"
import { State } from "../../background/types/State"
import { initialState } from "../../background"

type Props = { children: ReactNode }

const context = createContext<State>(initialState)

const StateContext = ({ children }: Props) => {
    const [state, setState] = useState<State>(initialState)

    useEffect(() => {
        var port = browser.runtime.connect({ name: "twitch-web-extension" })
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
    }, [])

    return <context.Provider value={state}>{children}</context.Provider>
}

const useAppState = () => {
    return useContext(context)
}

export { StateContext, useAppState }
