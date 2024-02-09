import { ReactNode } from "react"

type Props = {
    enabled: boolean
    onClick?: () => void
    children: ReactNode
}

/**
 * Children need the class `z-clickAwayElement`
 */
const ClickAwayOverlay = ({ enabled, onClick, children }: Props) => (
    <>
        {enabled && (
            <div
                className="fixed top-0 bottom-0 left-0 right-0 z-clickAwayListener"
                onClick={onClick}
            >
                &nbsp;
            </div>
        )}
        {children}
    </>
)
export default ClickAwayOverlay
