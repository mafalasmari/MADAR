import { useTranslations } from "next-intl";
import { Boxes, Landmark, Cpu, Building2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/card";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface EcosystemItem {
  name: string;
  tag: string;
  desc: string;
}

const ICONS = [Boxes, Landmark, Cpu, Building2];

/**
 * Section 5 — the wider Madar Group. Only MADAR Supply exists as a
 * shipping product today; the other three ventures are presented plainly
 * as future placeholders (a neutral icon, no invented sub-brand colors or
 * logos) until their own identity systems exist.
 */
export function Ecosystem() {
  const t = useTranslations("home.ecosystem");
  const items = t.raw("items") as EcosystemItem[];

  return (
    <section id="ecosystem" className="bg-madar-navy py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          tone="dark"
          className="mx-auto"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = ICONS[i] ?? Boxes;
            const isLive = i === 0;
            return (
              <ScrollReveal
                key={item.name}
                delay={i * 0.08}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="grid size-11 place-items-center rounded-xl bg-white/10 text-madar-amber">
                  <Icon className="size-5" />
                </div>
                <p className="mt-4 font-bold text-white">{item.name}</p>
                <Badge tone={isLive ? "amber" : "neutral"} className={isLive ? "mt-2" : "mt-2 bg-white/10 text-madar-on-navy-muted"}>
                  {item.tag}
                </Badge>
                <p className="mt-3 text-sm text-madar-on-navy-muted">{item.desc}</p>
              </ScrollReveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
