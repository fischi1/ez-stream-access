import React from "react"
import browser from "webextension-polyfill"
import { Message } from "../../../background"
import { Quality, qualities } from "../../../background/types/State"
import { useAppState } from "../../state/StateContext"
import RadioToggle from "../toggle/RadioToggle"

type Props = {}

const QualityControls = ({}: Props) => {
    const state = useAppState()

    const handleSelect = (newQuality: Quality) => {
        browser.runtime.sendMessage({
            action: "changeQuality",
            data: newQuality
        } as Message)
    }

    return (
        <fieldset>
            <legend>Quality</legend>
            <div className="flex gap-1">
                {Object.keys(qualities).map((key) => (
                    <RadioToggle
                        key={key}
                        name="qualities"
                        value={key}
                        checked={state?.streamState.quality === key}
                        onSelect={() => handleSelect(key as Quality)}
                    >
                        {qualities[key]}
                    </RadioToggle>
                ))}
            </div>
        </fieldset>
    )
}

export default QualityControls
