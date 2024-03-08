import { cleanup, render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import RadioToggle from "./RadioToggle"

beforeEach(() => {})

afterEach(() => {
    cleanup()
    vi.clearAllMocks()
})

describe("RadioToggle", () => {
    it("input id should match for attribute of label", async () => {
        const { container } = render(
            <RadioToggle
                value="toggle-value"
                name="test-toggle"
                checked
                onSelect={() => {}}
            >
                Test Toggle
            </RadioToggle>
        )

        expect(container.querySelector("input")?.getAttribute("id")).toBe(
            container.querySelector("label")?.getAttribute("for")
        )
    })

    it("additional classes are appended", async () => {
        const { container } = render(
            <RadioToggle
                value="toggle-value"
                name="test-toggle"
                checked
                onSelect={() => {}}
                className="mt-3"
            >
                Test Toggle
            </RadioToggle>
        )

        expect((container.firstChild as HTMLElement).className).toMatch(/mt-3$/)
    })
})
