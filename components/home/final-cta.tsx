import { useTranslations } from "next-intl";

import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { InterestForm } from "@/components/forms/interest-form";

export function FinalCta() {
  const t = useTranslations("home.finalCta");

  return (
    <section className="bg-madar-sand py-24 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <ScrollReveal>
          <p className="mb-3 text-sm font-bold tracking-wide text-madar-trade-blue uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl font-bold text-balance text-madar-navy sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-md text-lg text-madar-muted">{t("subtitle")}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <InterestForm />
        </ScrollReveal>
      </Container>
    </section>
  );
}
