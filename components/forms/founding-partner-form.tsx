"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label, Input, FieldError } from "@/components/ui/field";

const schema = z.object({
  name: z.string().trim().min(2),
  company: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().min(8).max(20),
});

type FormValues = z.infer<typeof schema>;

/**
 * The Section 6 modal form — Name, Company, Email, Phone, shared by both
 * the manufacturer and buyer CTAs. Front-end only, same pattern as
 * InterestForm/ContactForm elsewhere in this codebase: validates and shows
 * a success state, with no backend endpoint wired up yet.
 */
export function FoundingPartnerForm({ role }: { role: "manufacturer" | "buyer" }) {
  const t = useTranslations("home.founding.form");
  const tCommon = useTranslations("common");
  const [submitted, setSubmitted] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    // Simulated submission — point this at a real endpoint/CRM webhook
    // before launch. `role` would travel along as the lead's segment.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-3 py-6 text-center"
      >
        <CheckCircle2 className="size-10 text-madar-trade-blue" />
        <p className="text-lg font-bold text-madar-navy">{t("successTitle")}</p>
        <p className="text-sm text-madar-muted">{t("successDesc")}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <div>
        <Label htmlFor={`fp-name-${role}`}>{t("name")}</Label>
        <Input id={`fp-name-${role}`} autoComplete="name" {...register("name")} />
        <FieldError>{errors.name && tCommon("fieldRequired")}</FieldError>
      </div>
      <div>
        <Label htmlFor={`fp-company-${role}`}>{t("company")}</Label>
        <Input id={`fp-company-${role}`} autoComplete="organization" {...register("company")} />
        <FieldError>{errors.company && tCommon("fieldRequired")}</FieldError>
      </div>
      <div>
        <Label htmlFor={`fp-email-${role}`}>{t("email")}</Label>
        <Input id={`fp-email-${role}`} type="email" dir="ltr" autoComplete="email" {...register("email")} />
        <FieldError>{errors.email && tCommon("fieldInvalid")}</FieldError>
      </div>
      <div>
        <Label htmlFor={`fp-phone-${role}`}>{t("phone")}</Label>
        <Input id={`fp-phone-${role}`} type="tel" dir="ltr" autoComplete="tel" {...register("phone")} />
        <FieldError>{errors.phone && tCommon("fieldRequired")}</FieldError>
      </div>

      <Button type="submit" variant="cta" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
      <p className="text-xs text-madar-subtle">{t("privacyNote")}</p>
    </form>
  );
}
