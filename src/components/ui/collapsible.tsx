
"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className="overflow-hidden data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up transition-all duration-300 ease-in-out"
    {...props}
  >
    <div className="pt-1 animate-fade-in scrollbar-stable">{children}</div>
  </CollapsiblePrimitive.Content>
))

CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
