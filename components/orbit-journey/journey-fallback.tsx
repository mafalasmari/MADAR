import { useTranslations } from "next-intl";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

/**
 * Used when WebGL is unavailable, or the visitor asked for reduced motion.
 * Same 5-stage story, told as a gently scroll-revealed timeline instead of
 * a scroll-scrubbed camera flythrough — no Three.js, no scroll-jacking,
 * just the brand's own arc motif connecting five nodes. ScrollReveal
 * already reads prefers-reduced-motion itself (via framer-motion), so the
 * reveal quietly becomes an instant, motion-free fade for anyone who has
 * that preference set — no separate branch needed here.
 */
export function JourneyFallback() {
  const t = useTranslations("journey");
  const stages = [0, 1, 2, 3, 4].map((i) => ({
    eyebrow: t(`stages.${i}.eyebrow`),
    title: t(`stages.${i}.title`),
    desc: t(`stages.${i}.desc`),
  }));

  return (
    <section className="bg-madar-navy py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={t("sectionLabel")}
          title={t("fallbackTitle")}
          subtitle={t("fallbackSubtitle")}
          align="center"
          tone="dark"
          className="mx-auto"
        />

        <ol className="relative mx-auto mt-16 max-w-lg">
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 w-px bg-gradient-to-b from-madar-amber via-madar-trade-blue to-transparent ltr:left-[15px] rtl:right-[15px]"
          />
          {stages.map((stage, i) => (
            <ScrollReveal key={i} delay={i * 0.08} as="li" className="relative mb-10 ps-10 last:mb-0">
              <span className="absolute top-0 grid size-8 place-items-center rounded-full border-2 border-madar-amber bg-madar-navy text-xs font-bold text-madar-amber ltr:left-0 rtl:right-0">
                {i + 1}
              </span>
              <p className="text-xs font-bold tracking-[0.2em] text-madar-amber uppercase">
                {stage.eyebrow}
              </p>
              <h3 className="mt-1 text-lg font-bold text-white">{stage.title}</h3>
              <p className="mt-1.5 text-sm text-madar-on-navy-muted">{stage.desc}</p>
            </ScrollReveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
