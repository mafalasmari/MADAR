"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label, Input, Textarea, FieldError } from "@/components/ui/field";

const schema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  company: z.string().trim().optional(),
  message: z.string().trim().min(10),
});

type FormValues = z.infer<typeof schema>;

/** Front-end-only, same as InterestForm — needs a real endpoint before launch. */
export function ContactForm() {
  const t = useTranslations("contact.form");
  const tHomeForm = useTranslations("home.finalCta.form");
  const tCommon = useTranslations("common");
  const [submitted, setSubmitted] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-3 rounded-2xl border border-madar-line bg-white p-10 text-center"
      >
        <CheckCircle2 className="size-10 text-madar-trade-blue" />
        <p className="text-lg font-bold text-madar-navy">{tHomeForm("successTitle")}</p>
        <p className="text-sm text-madar-muted">{tHomeForm("successDesc")}</p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 rounded-2xl border border-madar-line bg-white p-6 sm:p-8"
      noValidate
    >
      <div>
        <Label htmlFor="c-name">{t("name")}</Label>
        <Input id="c-name" autoComplete="name" {...register("name")} />
        <FieldError>{errors.name && tCommon("fieldRequired")}</FieldError>
      </div>
      <div>
        <Label htmlFor="c-email">{t("email")}</Label>
        <Input id="c-email" type="email" dir="ltr" autoComplete="email" {...register("email")} />
        <FieldError>{errors.email && tCommon("fieldRequired")}</FieldError>
      </div>
      <div>
        <Label htmlFor="c-company">{t("company")}</Label>
        <Input id="c-company" autoComplete="organization" {...register("company")} />
      </div>
      <div>
        <Label htmlFor="c-message">{t("message")}</Label>
        <Textarea id="c-message" {...register("message")} />
        <FieldError>{errors.message && tCommon("fieldRequired")}</FieldError>
      </div>

      <Button type="submit" variant="cta" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? tHomeForm("submitting") : t("submit")}
      </Button>
    </form>
  );
}
