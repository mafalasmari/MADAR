"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

import { MadarLogo } from "@/components/brand/MadarLogo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroOrbitBackground } from "@/components/home/hero-orbit-background";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative overflow-hidden bg-madar-navy">
      <HeroOrbitBackground />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 15%, rgba(27,117,187,0.28), transparent)",
        }}
        aria-hidden="true"
      />

      <Container className="relative py-24 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-8 w-44 sm:w-56"
          >
            <MadarLogo variant="reversed" animate />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="mb-4 text-sm font-bold tracking-wide text-madar-amber uppercase"
          >
            {t("eyebrow")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.4 }}
            className="text-4xl font-bold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl"
          >
            {t("title")}{" "}
            <span className="text-madar-amber">{t("titleHighlight")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.55 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-madar-on-navy-muted sm:text-xl"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 1.7 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild variant="cta" size="lg">
              <a href="#founding">{t("ctaPrimary")}</a>
            </Button>
            <Button asChild variant="outlineOnNavy" size="lg">
              <a href="#journey">{t("ctaSecondary")}</a>
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
