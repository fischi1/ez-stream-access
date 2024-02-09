import clsx from "clsx"
import { ReactNode } from "react"

type Props = {
    value: string
    name: string
    checked: boolean
    onSelect: () => void
    className?: string
    children: ReactNode
}

const RadioToggle = ({
    value,
    name,
    checked,
    onSelect,
    className,
    children
}: Props) => (
    <div className={clsx("block", className)}>
        <input
            type="radio"
            id={`${name}-${value}`}
            name={name}
            value={value}
            checked={checked}
            className="w-0 h-0 peer"
            onClick={onSelect}
            required
        />
        <label
            htmlFor={`${name}-${value}`}
            className="inline-block border border-violet px-1 rounded-md cursor-pointer peer-checked:bg-violet peer-focus-visible:outline peer-focus-visible:outline-1 "
        >
            {children}
        </label>
    </div>
)

export default RadioToggle
