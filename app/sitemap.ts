import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";

const BASE_URL = "https://gomadar.sa";

const PATHS = ["", "/about", "/services", "/for-suppliers", "/for-buyers", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
        ),
      },
    })),
  );
}
