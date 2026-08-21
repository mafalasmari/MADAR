"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label, Input, Select, FieldError } from "@/components/ui/field";

const schema = z.object({
  name: z.string().trim().min(2),
  company: z.string().trim().min(2),
  segment: z.enum(["supplier", "buyer"]),
  phone: z.string().trim().min(8).max(20),
});

type FormValues = z.infer<typeof schema>;

/**
 * NOTE: this is a front-end-only lead form. There is no backend wired up
 * yet — submit currently just validates and shows the success state.
 * Point `onSubmitValues` (or replace the inline handler) at a real
 * endpoint/CRM webhook before launch.
 */
export function InterestForm({
  defaultSegment,
  className,
}: {
  defaultSegment?: FormValues["segment"];
  className?: string;
}) {
  const t = useTranslations("home.finalCta.form");
  const tCommon = useTranslations("common");
  const [submitted, setSubmitted] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { segment: defaultSegment ?? "supplier" },
  });

  const onSubmit = async () => {
    // Simulated submission — no backend endpoint exists yet.
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
        <p className="text-lg font-bold text-madar-navy">{t("successTitle")}</p>
        <p className="text-sm text-madar-muted">{t("successDesc")}</p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={className ?? "grid gap-4 rounded-2xl border border-madar-line bg-white p-6 sm:p-8"}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">{t("name")}</Label>
          <Input id="name" autoComplete="name" {...register("name")} />
          <FieldError>{errors.name && tCommon("fieldRequired")}</FieldError>
        </div>
        <div>
          <Label htmlFor="company">{t("company")}</Label>
          <Input id="company" autoComplete="organization" {...register("company")} />
          <FieldError>{errors.company && tCommon("fieldRequired")}</FieldError>
        </div>
        <div>
          <Label htmlFor="segment">{t("segment")}</Label>
          <Select id="segment" {...register("segment")}>
            <option value="supplier">{t("segmentSupplier")}</option>
            <option value="buyer">{t("segmentBuyer")}</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" type="tel" dir="ltr" autoComplete="tel" {...register("phone")} />
          <FieldError>{errors.phone && tCommon("fieldRequired")}</FieldError>
        </div>
      </div>

      <Button type="submit" variant="cta" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
      <p className="text-xs text-madar-subtle">{t("privacyNote")}</p>
    </form>
  );
}
