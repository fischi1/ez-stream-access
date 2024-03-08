import { initialState, qualities } from "@shared/types/State"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import browser from "../../../__mocks__/webextension-polyfill"
import { useAppState } from "../../state/StateContext"
import QualityControls from "./QualityControls"

vi.mock("../../state/StateContext")

vi.mock("webextension-polyfill")

beforeEach(() => {})

afterEach(() => {
    vi.clearAllMocks()
})

describe("QualityControls", () => {
    it("should select quality returned by app state", async () => {
        vi.mocked(useAppState).mockReturnValueOnce({
            ...initialState,
            streamState: { ...initialState.streamState, quality: "720p30" }
        })

        render(<QualityControls />)

        expect(
            await screen.findByLabelText(qualities["720p30"])
        ).toHaveProperty("checked", true)
        expect(
            await screen.findByLabelText(qualities["chunked"])
        ).toHaveProperty("checked", false)
    })

    it("should send a background message on click", async () => {
        vi.mocked(useAppState).mockReturnValueOnce({
            ...initialState,
            streamState: { ...initialState.streamState, quality: "720p60" }
        })

        render(<QualityControls />)

        fireEvent.click(await screen.findByLabelText(qualities["480p30"]))

        expect(browser.runtime.sendMessage).toBeCalledWith({
            action: "changeQuality",
            data: "480p30"
        })
    })

    it("should check newly selected element", async () => {
        vi.mocked(useAppState)
            .mockReturnValueOnce({
                ...initialState,
                streamState: { ...initialState.streamState, quality: "chunked" }
            })
            .mockReturnValue({
                ...initialState,
                streamState: { ...initialState.streamState, quality: "auto" }
            })

        render(<QualityControls />)

        fireEvent.click(await screen.findByLabelText(qualities["auto"]))

        const { container } = render(<QualityControls />)

        await waitFor(async () => {
            expect(browser.runtime.sendMessage).toHaveBeenCalledOnce()
            expect(
                container.querySelector<HTMLInputElement>('input[value="auto"]')
                    ?.checked
            ).toBeTruthy()
            expect(
                container.querySelector<HTMLInputElement>(
                    'input[value="chucked"]'
                )?.checked
            ).toBeFalsy()
        })
    })
})
