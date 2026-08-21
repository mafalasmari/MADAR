"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

export function AudienceTabs() {
  const t = useTranslations("home.audience");
  const [tab, setTab] = React.useState<"supplier" | "buyer">("supplier");

  const supplierBullets = t.raw("supplier.bullets") as string[];
  const buyerBullets = t.raw("buyer.bullets") as string[];
  const active = tab === "supplier"
    ? { headline: t("supplier.headline"), bullets: supplierBullets, cta: t("supplier.cta"), href: "/for-suppliers" as const }
    : { headline: t("buyer.headline"), bullets: buyerBullets, cta: t("buyer.cta"), href: "/for-buyers" as const };

  return (
    <section className="bg-white py-24 sm:py-28">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="center" className="mx-auto" />

        <div className="mx-auto mt-10 flex w-fit rounded-full border border-madar-line bg-madar-sand p-1">
          {(["supplier", "buyer"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-bold transition-colors",
                tab === key ? "bg-madar-navy text-white" : "text-madar-ink-muted hover:text-madar-navy",
              )}
            >
              {t(key === "supplier" ? "supplierTab" : "buyerTab")}
            </button>
          ))}
        </div>

        <div className="relative mx-auto mt-12 min-h-[22rem] max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="rounded-3xl border border-madar-line bg-madar-sand-soft p-8 text-center sm:p-10"
            >
              <h3 className="text-2xl font-bold text-balance text-madar-navy">
                {active.headline}
              </h3>
              <ul className="mx-auto mt-6 max-w-md space-y-3 text-start">
                {active.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-madar-trade-blue" />
                    <span className="text-[15px] text-madar-ink-muted">{bullet}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="cta" className="mt-8">
                <Link href={active.href}>{active.cta}</Link>
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
