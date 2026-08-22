"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Factory, Store } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FoundingPartnerForm } from "@/components/forms/founding-partner-form";

type Role = "manufacturer" | "buyer";

/** Section 6 — the dual founding-partner CTAs, each opening its own modal form. */
export function FoundingPartners() {
  const t = useTranslations("home.founding");
  const [openRole, setOpenRole] = React.useState<Role | null>(null);

  const cards: { role: Role; icon: typeof Factory }[] = [
    { role: "manufacturer", icon: Factory },
    { role: "buyer", icon: Store },
  ];

  return (
    <section id="founding" className="bg-white py-24 sm:py-28">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} align="center" className="mx-auto" />

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
          {cards.map(({ role, icon: Icon }, i) => (
            <ScrollReveal
              key={role}
              delay={i * 0.1}
              className="flex flex-col rounded-3xl border border-madar-line bg-madar-sand-soft p-8 text-center"
            >
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-madar-navy text-white">
                <Icon className="size-6" />
              </div>
              <p className="mt-5 text-lg font-bold text-madar-navy">{t(`${role}.title`)}</p>
              <p className="mt-2 flex-1 text-sm text-madar-muted">{t(`${role}.desc`)}</p>
              <Button
                type="button"
                variant="cta"
                size="lg"
                className="mt-6"
                onClick={() => setOpenRole(role)}
              >
                {t(`${role}.cta`)}
              </Button>
            </ScrollReveal>
          ))}
        </div>
      </Container>

      <Modal
        open={openRole !== null}
        onClose={() => setOpenRole(null)}
        title={openRole ? t(`form.${openRole}Title`) : ""}
        closeLabel={t("form.closeLabel")}
      >
        {openRole && <FoundingPartnerForm role={openRole} />}
      </Modal>
    </section>
  );
}
