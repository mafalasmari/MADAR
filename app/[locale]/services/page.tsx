import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShieldCheck, PackageSearch, Wallet } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/card";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const icons = [ShieldCheck, PackageSearch, Wallet];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return { title: t("hero.title"), description: t("hero.subtitle") };
}

interface ServiceItem {
  badge: string;
  title: string;
  desc: string;
  points: string[];
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const items = t.raw("items") as ServiceItem[];

  return (
    <>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="bg-white py-20 sm:py-24">
        <Container className="space-y-8">
          {items.map((item, i) => {
            const Icon = icons[i] ?? ShieldCheck;
            const isFuture = i === 2;
            return (
              <ScrollReveal
                key={item.title}
                delay={i * 0.06}
                className="grid gap-6 rounded-3xl border border-madar-line bg-madar-sand-soft p-8 sm:grid-cols-[auto_1fr] sm:p-10"
              >
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white text-madar-trade-blue shadow-sm">
                  <Icon className="size-7" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold text-madar-navy">{item.title}</h2>
                    <Badge tone={isFuture ? "amber" : "blue"}>{item.badge}</Badge>
                  </div>
                  <p className="mt-3 max-w-2xl text-madar-ink-muted">{item.desc}</p>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-3">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="rounded-lg bg-white px-3 py-2 text-sm text-madar-ink-muted"
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            );
          })}
        </Container>
      </section>
    </>
  );
}
