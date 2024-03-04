import { useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import browser from "webextension-polyfill"
import { Message } from "../../../shared/types/Message"
import { useAppState } from "../../state/StateContext"

type Props = {}

const Toasts = ({}: Props) => {
    const { toasts } = useAppState()

    useEffect(() => {
        if (toasts.length === 0) {
            return
        }
        for (let t of toasts) {
            switch (t.type) {
                case "error":
                    toast.error(t.message)
                    break
                case "info":
                    toast.info(t.message)
                    break
                case "success":
                    toast.success(t.message)
                    break
                case "warn":
                    toast.warn(t.message)
                    break
            }
        }
        browser.runtime.sendMessage({
            action: "clearToasts"
        } satisfies Message)
    }, [toasts])

    return (
        <ToastContainer
            position="top-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="dark"
            limit={5}
        />
    )
}

export default Toasts
