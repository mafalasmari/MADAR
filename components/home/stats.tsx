import { useTranslations } from "next-intl";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

export function Stats() {
  const t = useTranslations("home.stats");
  const items = t.raw("items") as StatItem[];

  return (
    <section className="bg-white py-24 sm:py-28">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="center" className="mx-auto" />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <ScrollReveal key={item.label} delay={i * 0.08} className="text-center">
              <p className="text-4xl font-bold text-madar-trade-blue sm:text-5xl">
                <AnimatedCounter value={item.value} suffix={item.suffix} />
              </p>
              <p className="mt-3 text-sm text-madar-muted">{item.label}</p>
            </ScrollReveal>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-madar-subtle">
          {t("note")}
        </p>
      </Container>
    </section>
  );
}
