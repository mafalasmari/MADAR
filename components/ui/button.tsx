import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * `cta` is the only variant that touches Harvest Amber, per brand rule:
 * "أزرار الحث على اتخاذ إجراء فقط" — amber is for calls to action only,
 * never a general accent color.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        cta: "bg-madar-amber text-madar-navy shadow-[0_1px_0_rgba(0,0,0,0.05)] hover:brightness-105 hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-madar-amber active:translate-y-0",
        primary:
          "bg-madar-trade-blue text-white hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-madar-trade-blue active:translate-y-0",
        outline:
          "border border-madar-line bg-transparent text-madar-navy hover:bg-madar-sand focus-visible:ring-madar-trade-blue",
        outlineOnNavy:
          "border border-white/25 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white/40",
        ghost: "text-madar-navy hover:bg-madar-sand",
        ghostOnNavy: "text-white hover:bg-white/10",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
