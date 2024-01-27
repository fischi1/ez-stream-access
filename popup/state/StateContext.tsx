import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState
} from "react"
import browser from "webextension-polyfill"
import { State } from "../../background/types/State"

type Props = { children: ReactNode }

const context = createContext<State | undefined>(undefined)

const StateContext = ({ children }: Props) => {
    const [state, setState] = useState<State>()

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

    return (
        <context.Provider value={state}>
            {children}
            <p className="whitespace-break-spaces font-mono py-4 text-background">
                {JSON.stringify(state, null, 4)}
            </p>
        </context.Provider>
    )
}

const useAppState = () => {
    return useContext(context)
}

export { StateContext, useAppState }
