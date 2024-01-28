import React from "react"

type Props = {
    value: string
    name: string
}

const RadioToggle = ({ value, name }: Props) => {
    return (
        <div className="inline-block">
            <input
                type="radio"
                id={`${name}-${value}`}
                name={name}
                value={value}
                className="w-0 h-0 peer"
                required
            />
            <label
                htmlFor={`${name}-${value}`}
                className="inline-block border border-violet px-1 rounded-md cursor-pointer peer-checked:bg-violet peer-focus-visible:outline peer-focus-visible:outline-1 "
            >
                720p60
            </label>
        </div>
    )
}

export default RadioToggle
