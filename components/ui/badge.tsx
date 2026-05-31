import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#3fb68b]/15 text-[#3fb68b] border border-[#3fb68b]/30",
        secondary: "bg-[#1c2330] text-[#8b949e] border border-[#30363d]",
        destructive: "bg-red-900/15 text-red-400 border border-red-800/30",
        warning: "bg-yellow-900/15 text-yellow-400 border border-yellow-800/30",
        info: "bg-blue-900/15 text-blue-400 border border-blue-800/30",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
