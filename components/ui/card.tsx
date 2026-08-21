import * as React from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-madar-line bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({
  className,
  tone = "blue",
  ...props
}: React.ComponentProps<"span"> & { tone?: "blue" | "amber" | "neutral" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase",
        tone === "blue" && "bg-madar-trade-blue/10 text-madar-trade-blue",
        tone === "amber" && "bg-madar-amber/15 text-[#8a5c10]",
        tone === "neutral" && "bg-madar-sand text-madar-muted",
        className,
      )}
      {...props}
    />
  );
}
