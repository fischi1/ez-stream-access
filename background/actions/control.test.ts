import { expect } from "@jest/globals"
import { Quality, State, initialState } from "@shared/types/State"
import { Context } from ".."
import { changeQuality } from "./controls"

describe("changeQuality", () => {
    it("should apply new quality to state", async () => {
        const quality: Quality = "720p60"

        let setStateCalled = false
        changeQuality(quality, {
            setState: (updateStateFunction: (oldState: State) => State) => {
                setStateCalled = true
                expect(
                    updateStateFunction(initialState).streamState.quality
                ).toBe(quality)
            }
        } as unknown as Context)

        expect(setStateCalled).toBeTruthy()
    })
})
