import * as React from "react";

import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-semibold text-madar-navy", className)}
      {...props}
    />
  );
}

const fieldStyles =
  "w-full rounded-lg border border-madar-line bg-white px-3.5 py-2.5 text-[15px] text-madar-ink placeholder:text-madar-subtle outline-none transition-colors focus:border-madar-trade-blue focus:ring-2 focus:ring-madar-trade-blue/20";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(fieldStyles, className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(fieldStyles, "min-h-32 resize-y", className)} {...props} />;
}

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select className={cn(fieldStyles, "appearance-none bg-white", className)} {...props} />;
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1.5 text-sm text-madar-error">{children}</p>;
}
