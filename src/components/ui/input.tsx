import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border bg-input px-3 py-2 text-base text-foreground transition-all duration-200 ring-offset-ring-offset file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-input-placeholder placeholder:opacity-60 focus-visible:outline-2 focus-visible:outline-focus-outline focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-button-disabled disabled:text-button-disabled-foreground disabled:border-button-disabled-border disabled:placeholder:text-button-disabled-foreground md:text-sm [&::-webkit-input-placeholder]:text-input-placeholder [&::-webkit-input-placeholder]:opacity-60 [&::-moz-placeholder]:text-input-placeholder [&::-moz-placeholder]:opacity-60 [&:-ms-input-placeholder]:text-input-placeholder [&:-ms-input-placeholder]:opacity-60 selection:bg-input-selection/40 selection:text-foreground caret-input-caret [&:-webkit-autofill]:bg-input [&:-webkit-autofill]:text-foreground [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_hsl(var(--input))] [&:-webkit-autofill:hover]:shadow-[inset_0_0_0px_1000px_hsl(var(--input))] [&:-webkit-autofill:focus]:shadow-[inset_0_0_0px_1000px_hsl(var(--input))]",
  {
    variants: {
      variant: {
        default: "border-input-border hover:border-border-strong focus-visible:border-primary focus-visible:ring-focus-ring/30 focus-visible:outline-focus-outline",
        success: "border-success focus-visible:border-success focus-visible:ring-success/30 focus-visible:outline-success",
        warning: "border-warning focus-visible:border-warning focus-visible:ring-warning/30 focus-visible:outline-warning", 
        destructive: "border-destructive focus-visible:border-destructive focus-visible:ring-error/30 focus-visible:outline-error",
        ghost: "border-transparent bg-secondary hover:bg-secondary/80 focus-visible:bg-background focus-visible:border-border focus-visible:ring-focus-ring/30 focus-visible:outline-focus-outline"
      },
      size: {
        sm: "h-8 px-2 text-sm",
        default: "h-10 px-3",
        lg: "h-12 px-4 text-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
