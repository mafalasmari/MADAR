import { useTranslations } from "next-intl";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";
import { OrbitDisruption } from "@/components/home/orbit-disruption";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

/** Section 2 — the fragmented market the orbit exists to fix. */
export function Problem() {
  const t = useTranslations("home.problem");
  const stats = t.raw("stats") as StatItem[];

  return (
    <section id="problem" className="bg-white py-24 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
          <ScrollReveal delay={0.1}>
            <OrbitDisruption variant="scatter" className="mx-auto w-full max-w-md" />
          </ScrollReveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {stats.map((item, i) => (
            <ScrollReveal
              key={item.label}
              delay={i * 0.08}
              className="rounded-2xl border border-madar-line bg-madar-sand-soft p-6 text-center"
            >
              <p className="text-4xl font-bold text-madar-navy sm:text-5xl">
                <AnimatedCounter value={item.value} suffix={item.suffix} />
              </p>
              <p className="mt-3 text-sm text-madar-muted">{item.label}</p>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
