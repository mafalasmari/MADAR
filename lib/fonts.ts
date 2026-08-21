import localFont from "next/font/local";

/**
 * IBM Plex Sans Arabic — the Madar brand typeface. One family unifies the
 * Arabic and Latin text per the brand system ("خط واحد ... يوّحد النصوص
 * العربية والالتينية"). Self-hosted locally (no Google Fonts CDN): the
 * actual IBM-released, OFL-licensed font binaries, vendored from the
 * official @fontsource/ibm-plex-sans-arabic package into /fonts. Only the
 * two weights the brand spec calls for — Regular and Bold — are loaded.
 *
 * The Arabic and Latin glyph subsets ship as separate files (standard
 * subsetting for a mixed-script family), so each script gets its own
 * next/font/local declaration and CSS variable; layout.tsx picks the
 * script-appropriate order per locale while keeping the other as fallback
 * so embedded Latin (numerals, "GoMadar.sa") still renders inside Arabic
 * pages and vice versa.
 */
export const plexArabic = localFont({
  variable: "--font-plex-arabic",
  display: "swap",
  src: [
    {
      path: "../fonts/IBMPlexSansArabic-Arabic-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/IBMPlexSansArabic-Arabic-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const plexLatin = localFont({
  variable: "--font-plex-latin",
  display: "swap",
  src: [
    {
      path: "../fonts/IBMPlexSansArabic-Latin-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/IBMPlexSansArabic-Latin-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});
