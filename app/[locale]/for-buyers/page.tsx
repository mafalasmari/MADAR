import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { InterestForm } from "@/components/forms/interest-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "forBuyers" });
  return { title: t("hero.title"), description: t("hero.subtitle") };
}

interface Prop {
  title: string;
  desc: string;
}
interface Step {
  title: string;
  desc: string;
}

export default async function ForBuyersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("forBuyers");
  const valueprops = t.raw("valueprops") as Prop[];
  const steps = t.raw("steps.items") as Step[];

  return (
    <>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="bg-white py-20 sm:py-24">
        <Container className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="grid gap-5 sm:grid-cols-2">
              {valueprops.map((item, i) => (
                <ScrollReveal
                  key={item.title}
                  delay={i * 0.06}
                  className="rounded-2xl border border-madar-line bg-madar-sand-soft p-6"
                >
                  <CheckCircle2 className="size-5 text-madar-trade-blue" />
                  <p className="mt-3 font-bold text-madar-navy">{item.title}</p>
                  <p className="mt-1.5 text-sm text-madar-ink-muted">{item.desc}</p>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.15} className="mt-10">
              <h2 className="mb-5 text-sm font-bold tracking-wide text-madar-trade-blue uppercase">
                {t("steps.title")}
              </h2>
              <ol className="space-y-4">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-madar-navy text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-madar-navy">{step.title}</p>
                      <p className="mt-0.5 text-sm text-madar-muted">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.1}>
            <h2 className="mb-4 text-xl font-bold text-madar-navy">{t("formTitle")}</h2>
            <InterestForm defaultSegment="buyer" />
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
