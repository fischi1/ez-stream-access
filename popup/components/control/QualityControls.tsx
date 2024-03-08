import { Message } from "@shared/types/Message"
import { Quality, qualities } from "@shared/types/State"
import browser from "webextension-polyfill"
import { useAppState } from "../../state/StateContext"
import RadioToggle from "../toggle/RadioToggle"

type Props = {}

const QualityControls = ({}: Props) => {
    const { streamState } = useAppState()

    const handleSelect = (newQuality: Quality) => {
        browser.runtime.sendMessage({
            action: "changeQuality",
            data: newQuality
        } satisfies Message)
    }

    return (
        <fieldset className="flex gap-1">
            <div className="pr-1">Quality</div>
            {Object.keys(qualities).map((key) => (
                <RadioToggle
                    key={key}
                    name="qualities"
                    value={key}
                    checked={streamState.quality === key}
                    onSelect={() => handleSelect(key as Quality)}
                >
                    {qualities[key as Quality]}
                </RadioToggle>
            ))}
        </fieldset>
    )
}

export default QualityControls
