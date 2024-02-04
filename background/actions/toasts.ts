import { UpdateStateFunction } from ".."
import { Toast } from "../types/State"

const addToast = async (toast: Toast, updateState: UpdateStateFunction) => {
    updateState((oldState) => ({
        ...oldState,
        toasts: [...oldState.toasts, toast]
    }))
}

const clearToasts = async (updateState: UpdateStateFunction) => {
    updateState((oldState) => ({
        ...oldState,
        toasts: []
    }))
}

export { addToast, clearToasts }
