import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MadarSmile } from "@/components/brand/MadarLogo";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-[70svh] items-center bg-madar-navy py-24 text-white">
      <Container className="text-center">
        <div className="mx-auto mb-6 w-40 opacity-70">
          <MadarSmile color="#ffffff" />
        </div>
        <p className="mb-3 text-sm font-bold tracking-wide text-madar-amber uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="text-3xl font-bold text-balance sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-madar-on-navy-muted">
          {t("subtitle")}
        </p>
        <Button asChild variant="cta" className="mt-8">
          <Link href="/">{t("cta")}</Link>
        </Button>
      </Container>
    </div>
  );
}
