import { defineRouting } from "next-intl/routing";

// Arabic first, per the Madar governing principles ("العربية أوًال — الواجهة
// والمراسالت رسمية بالعربية"): Arabic is the default locale, English is the
// professional secondary. Both are always prefixed so the toggle is explicit
// and either can be linked to directly.
export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
