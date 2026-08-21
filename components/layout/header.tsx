"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { MadarLogo } from "@/components/brand/MadarLogo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/services", label: t("services") },
    { href: "/for-suppliers", label: t("forSuppliers") },
    { href: "/for-buyers", label: t("forBuyers") },
    { href: "/contact", label: t("contact") },
  ] as const;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-madar-line bg-white/90 backdrop-blur-md"
          : "border-transparent bg-white/60 backdrop-blur-sm",
      )}
    >
      <Container className="flex h-18 items-center justify-between py-3">
        <Link href="/" className="w-28 shrink-0 sm:w-32" aria-label="Madar">
          <MadarLogo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "text-madar-trade-blue"
                    : "text-madar-ink-muted hover:text-madar-navy",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher className="text-madar-navy" />
          <Button asChild variant="cta" size="sm">
            <Link href="/contact">{t("cta")}</Link>
          </Button>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-full text-madar-navy lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t("closeMenu") : t("toggleMenu")}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-madar-line bg-white lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-[15px] font-semibold text-madar-ink-muted hover:bg-madar-sand hover:text-madar-navy"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-madar-line pt-4">
                <LocaleSwitcher className="text-madar-navy" />
                <Button asChild variant="cta" size="sm">
                  <Link href="/contact" onClick={() => setOpen(false)}>
                    {t("cta")}
                  </Link>
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
