import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone } from "lucide-react";

import { LinkedinIcon, TwitterIcon, InstagramIcon } from "@/components/layout/social-icons";

import { Link } from "@/i18n/navigation";
import { MadarLogo } from "@/components/brand/MadarLogo";
import { Container } from "@/components/ui/container";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  const platformLinks = [
    { href: "/services", label: tNav("services") },
    { href: "/for-suppliers", label: tNav("forSuppliers") },
    { href: "/for-buyers", label: tNav("forBuyers") },
  ] as const;

  const companyLinks = [
    { href: "/about", label: tNav("about") },
    { href: "/contact", label: tNav("contact") },
  ] as const;

  // Placeholders — swap for the real handles before launch.
  const socialLinks = [
    { href: "#", label: t("social.linkedin"), icon: LinkedinIcon },
    { href: "#", label: t("social.twitter"), icon: TwitterIcon },
    { href: "#", label: t("social.instagram"), icon: InstagramIcon },
  ] as const;

  return (
    <footer className="border-t border-madar-navy-line bg-madar-navy text-white">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="w-28">
            <MadarLogo variant="reversed" />
          </div>
          <p className="mt-4 max-w-xs text-sm text-madar-on-navy-muted">
            {t("tagline")}
          </p>
          <div className="mt-5 flex items-center gap-3">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid size-9 place-items-center rounded-full border border-white/15 text-white/85 transition-colors hover:border-madar-amber hover:text-madar-amber"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold tracking-wide text-madar-on-navy-muted uppercase">
            {t("columns.platform")}
          </h3>
          <ul className="space-y-3">
            {platformLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/85 transition-colors hover:text-madar-amber"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold tracking-wide text-madar-on-navy-muted uppercase">
            {t("columns.company")}
          </h3>
          <ul className="space-y-3">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/85 transition-colors hover:text-madar-amber"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold tracking-wide text-madar-on-navy-muted uppercase">
            {t("columns.contact")}
          </h3>
          <ul className="space-y-3 text-sm text-white/85">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-madar-amber" />
              <span>{t("hq")}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-madar-amber" />
              <a href="mailto:Info@GoMadar.sa" className="hover:text-madar-amber">
                Info@GoMadar.sa
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-madar-amber" />
              <a href="tel:+966552049409" dir="ltr" className="hover:text-madar-amber">
                +966 55 204 9409
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-madar-navy-line">
        <Container className="flex flex-col gap-2 py-6 text-xs text-madar-on-navy-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>{t("rights", { year })}</p>
          <p>{t("legalNote")}</p>
        </Container>
      </div>
    </footer>
  );
}
