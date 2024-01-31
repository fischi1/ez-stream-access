import clsx from "clsx"
import React, { ReactNode } from "react"

type Props = {
    onClick?: () => void
    disabled?: boolean
    className?: string
    children: ReactNode
}

const Button = ({ onClick, disabled, className, children }: Props) => {
    return (
        <button
            className={clsx(
                "bg-violet px-2 py-1 rounded-md font-bold disabled:bg-violetDarker disabled:text-slate-300",
                className
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Button
