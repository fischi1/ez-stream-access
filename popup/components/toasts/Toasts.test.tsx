import { initialState, qualities } from "@shared/types/State"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import browser from "../../../__mocks__/webextension-polyfill"
import { useAppState } from "../../state/StateContext"
import Toasts from "./Toasts"
import { toast } from "react-toastify"

vi.mock("../../state/StateContext")

vi.mock("webextension-polyfill")

vi.mock("react-toastify", () => ({
    toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn() },
    ToastContainer: () => {}
}))

beforeEach(() => {})

afterEach(() => {
    vi.clearAllMocks()
})

describe("Toasts", () => {
    it("should trigger single toast", async () => {
        vi.mocked(useAppState).mockReturnValue({
            ...initialState,
            toasts: [{ message: "hello world", type: "success" }]
        })

        render(<Toasts />)

        expect(toast.success).toHaveBeenCalledWith("hello world")
    })

    it("should trigger multiple toasts", async () => {
        vi.mocked(useAppState).mockReturnValue({
            ...initialState,
            toasts: [
                { message: "hello world 1", type: "success" },
                { message: "hello world 2", type: "info" },
                { message: "hello world 3", type: "warn" }
            ]
        })

        render(<Toasts />)

        expect(toast.success).toHaveBeenCalledWith("hello world 1")
        expect(toast.info).toHaveBeenCalledWith("hello world 2")
        expect(toast.warn).toHaveBeenCalledWith("hello world 3")
    })

    it("should clear queue after handling all toasts", async () => {
        vi.mocked(useAppState).mockReturnValue({
            ...initialState,
            toasts: [{ message: "hello world 1", type: "success" }]
        })

        render(<Toasts />)

        expect(toast.success).toHaveBeenCalledWith("hello world 1")
        expect(browser.runtime.sendMessage).toBeCalledWith({
            action: "clearToasts"
        })
    })

    it("should not trigger a clear if there are no toasts", async () => {
        vi.mocked(useAppState).mockReturnValue({
            ...initialState
        })

        render(<Toasts />)

        expect(browser.runtime.sendMessage).not.toHaveBeenCalled()
    })
})
