"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const nextLocale = locale === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      onClick={() =>
        router.replace(
          // @ts-expect-error -- pathname is a dynamic route union; params are passed through untyped intentionally.
          { pathname, params },
          { locale: nextLocale },
        )
      }
      className={cn(
        "rounded-full border border-current/20 px-3.5 py-1.5 text-sm font-semibold transition-colors hover:bg-current/10",
        className,
      )}
      aria-label={t("languageSwitch")}
    >
      {t("languageSwitch")}
    </button>
  );
}
