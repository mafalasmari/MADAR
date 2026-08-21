import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("hero.title"), description: t("hero.subtitle") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const principles = t.raw("principles.items") as { title: string; desc: string }[];

  return (
    <>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="bg-white py-20 sm:py-24">
        <Container className="max-w-3xl">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-madar-navy">{t("story.title")}</h2>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-madar-ink-muted">
              {t("story.body")}
            </p>
          </ScrollReveal>
        </Container>
      </section>

      <section className="bg-madar-sand py-20 sm:py-24">
        <Container className="grid gap-6 sm:grid-cols-2">
          <ScrollReveal className="rounded-2xl border border-madar-line bg-white p-8">
            <h3 className="text-lg font-bold text-madar-trade-blue">{t("mission.title")}</h3>
            <p className="mt-3 text-madar-ink-muted">{t("mission.body")}</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1} className="rounded-2xl border border-madar-line bg-white p-8">
            <h3 className="text-lg font-bold text-madar-trade-blue">{t("vision.title")}</h3>
            <p className="mt-3 text-madar-ink-muted">{t("vision.body")}</p>
          </ScrollReveal>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container className="max-w-3xl">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-madar-navy">{t("whyNow.title")}</h2>
            <p className="mt-4 text-lg leading-relaxed text-pretty text-madar-ink-muted">
              {t("whyNow.body")}
            </p>
          </ScrollReveal>
        </Container>
      </section>

      <section className="bg-madar-navy py-20 sm:py-24">
        <Container>
          <ScrollReveal className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold text-white">{t("principles.title")}</h2>
          </ScrollReveal>
          <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
            {principles.map((p, i) => (
              <ScrollReveal
                key={p.title}
                delay={i * 0.08}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <p className="font-bold text-white">{p.title}</p>
                <p className="mt-2 text-sm text-madar-on-navy-muted">{p.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
