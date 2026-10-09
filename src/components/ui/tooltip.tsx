import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"
import type { ReactElement, ReactNode } from "react"

type TooltipProps = {
  children: ReactElement
  content: ReactNode
}

export function Tooltip({ children, content }: TooltipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger render={children} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side="top" sideOffset={4}>
          <TooltipPrimitive.Popup className="z-50 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md">
            {content}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
