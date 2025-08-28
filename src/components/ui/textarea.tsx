import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input-border bg-input px-3 py-2 text-sm text-foreground ring-offset-ring-offset placeholder:text-input-placeholder placeholder:opacity-60 focus-visible:outline-2 focus-visible:outline-focus-outline focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 hover:border-border-strong focus-visible:border-primary focus-visible:ring-focus-ring/30 disabled:cursor-not-allowed disabled:bg-button-disabled disabled:text-button-disabled-foreground disabled:border-button-disabled-border disabled:placeholder:text-button-disabled-foreground selection:bg-input-selection/40 selection:text-foreground caret-input-caret [&::-webkit-input-placeholder]:text-input-placeholder [&::-webkit-input-placeholder]:opacity-60 [&::-moz-placeholder]:text-input-placeholder [&::-moz-placeholder]:opacity-60 [&:-ms-input-placeholder]:text-input-placeholder [&:-ms-input-placeholder]:opacity-60",
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
