import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface Item {
  title: string;
  desc: string;
}

export function NeutralityCharter() {
  const t = useTranslations("home.neutrality");
  const items = t.raw("items") as Item[];

  return (
    <section className="bg-madar-sand py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <ScrollReveal
              key={item.title}
              delay={(i % 3) * 0.08}
              className="flex gap-4 rounded-2xl border border-madar-line bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-madar-trade-blue" />
              <div>
                <p className="font-bold text-madar-navy">{item.title}</p>
                <p className="mt-1.5 text-sm text-madar-muted">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
