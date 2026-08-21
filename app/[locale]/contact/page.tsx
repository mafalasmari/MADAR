import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";

import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ContactForm } from "@/components/forms/contact-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("hero.title"), description: t("hero.subtitle") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <PageHero eyebrow={t("hero.eyebrow")} title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <section className="bg-white py-20 sm:py-24">
        <Container className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <ScrollReveal>
            <h2 className="mb-6 text-xl font-bold text-madar-navy">{t("formTitle")}</h2>
            <ContactForm />
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="space-y-6">
            <div className="flex items-start gap-4 rounded-2xl border border-madar-line bg-madar-sand-soft p-6">
              <MapPin className="mt-0.5 size-6 shrink-0 text-madar-trade-blue" />
              <div>
                <p className="font-bold text-madar-navy">{t("info.hqTitle")}</p>
                <p className="mt-1 text-madar-ink-muted">{t("info.hq")}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-madar-line bg-madar-sand-soft p-6">
              <Mail className="mt-0.5 size-6 shrink-0 text-madar-trade-blue" />
              <div>
                <p className="font-bold text-madar-navy">{t("info.emailTitle")}</p>
                <a href="mailto:Info@GoMadar.sa" className="mt-1 block text-madar-trade-blue">
                  Info@GoMadar.sa
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-madar-line bg-madar-sand-soft p-6">
              <Phone className="mt-0.5 size-6 shrink-0 text-madar-trade-blue" />
              <div>
                <p className="font-bold text-madar-navy">{t("info.phoneTitle")}</p>
                <a href="tel:+966552049409" dir="ltr" className="mt-1 block text-madar-trade-blue">
                  +966 55 204 9409
                </a>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
