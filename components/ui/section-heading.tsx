import * as React from "react";

import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  tone?: "light" | "dark";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "start",
  tone = "light",
  className,
}: SectionHeadingProps) {
  const isDark = tone === "dark";
  return (
    <ScrollReveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-sm font-bold tracking-wide uppercase",
            isDark ? "text-madar-amber" : "text-madar-trade-blue",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight text-balance sm:text-4xl",
          isDark ? "text-white" : "text-madar-navy",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-lg text-pretty",
            isDark ? "text-madar-on-navy-muted" : "text-madar-muted",
          )}
        >
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}
