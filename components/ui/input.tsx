import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-[#30363d] bg-[#1c2330] px-3 py-1 text-sm text-[#e6edf3] shadow-sm transition-colors placeholder:text-[#6e7681] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#3fb68b] focus-visible:border-[#3fb68b] disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
