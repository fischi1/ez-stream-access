import { Toast } from "@shared/types/State"
import { Context } from ".."

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
