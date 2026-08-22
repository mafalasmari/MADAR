import { useTranslations } from "next-intl";
import { ShieldCheck, RefreshCcw, Landmark } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { OrbitDisruption } from "@/components/home/orbit-disruption";

interface Pillar {
  title: string;
  desc: string;
}

const ICONS = [ShieldCheck, RefreshCcw, Landmark];

/** Section 3 — the scattered market snaps back into one unified orbit. */
export function Solution() {
  const t = useTranslations("home.solution");
  const pillars = t.raw("pillars") as Pillar[];

  return (
    <section id="solution" className="bg-madar-sand py-24 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <ScrollReveal className="order-2 lg:order-1">
            <OrbitDisruption variant="reform" className="mx-auto w-full max-w-md" />
          </ScrollReveal>
          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
          </div>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {pillars.map((pillar, i) => {
            const Icon = ICONS[i] ?? ShieldCheck;
            return (
              <ScrollReveal
                key={pillar.title}
                delay={i * 0.08}
                className="rounded-2xl border border-madar-line bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="grid size-11 place-items-center rounded-xl bg-madar-navy text-white">
                  <Icon className="size-5" />
                </div>
                <p className="mt-4 font-bold text-madar-navy">{pillar.title}</p>
                <p className="mt-1.5 text-sm text-madar-muted">{pillar.desc}</p>
              </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
