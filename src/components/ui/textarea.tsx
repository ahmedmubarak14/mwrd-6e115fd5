import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input-border bg-input px-3 py-2 text-sm ring-offset-background placeholder:text-input-placeholder focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:border-border-strong focus-visible:border-primary focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-button-disabled disabled:text-button-disabled-foreground disabled:border-button-disabled-border disabled:placeholder:text-button-disabled-foreground/70 selection:bg-input-selection/30 selection:text-foreground caret-input-caret [&::-webkit-input-placeholder]:text-input-placeholder [&::-moz-placeholder]:text-input-placeholder [&:-ms-input-placeholder]:text-input-placeholder",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
