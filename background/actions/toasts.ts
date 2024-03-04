import { Context } from ".."
import { Toast } from "../../shared/types/State"

const addToast = async (toast: Toast, { setState }: Context) => {
    setState((oldState) => ({
        ...oldState,
        toasts: [...oldState.toasts, toast]
    }))
}

const clearToasts = async ({ setState }: Context) => {
    setState((oldState) => ({
        ...oldState,
        toasts: []
    }))
}

export { addToast, clearToasts }
