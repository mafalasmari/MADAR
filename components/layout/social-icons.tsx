import type { SVGProps } from "react";

/**
 * lucide-react 1.x (this project's pinned version) ships no brand/social
 * glyphs — only generic UI icons — so these three are minimal hand-drawn
 * monochrome marks (currentColor, 24x24 viewBox) rather than a second icon
 * dependency for three footer links.
 */
export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 8.5H3.56V20.5H6.94V8.5Z" />
      <path d="M5.25 7C6.35 7 7.25 6.1 7.25 5C7.25 3.9 6.35 3 5.25 3C4.14 3 3.25 3.9 3.25 5C3.25 6.1 4.14 7 5.25 7Z" />
      <path d="M13.28 8.5H10.06V20.5H13.28V14.5C13.28 12.85 13.83 11.5 15.34 11.5C16.83 11.5 16.94 12.9 16.94 14.6V20.5H20.16V13.9C20.16 10.4 18.66 8.25 15.94 8.25C14.28 8.25 13.5 9.1 13.28 9.7V8.5Z" />
    </svg>
  );
}

export function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.53 3H20.7L13.8 10.98L21.9 21H15.55L10.6 14.62L4.94 21H1.76L9.14 12.46L1.37 3H7.88L12.35 8.79L17.53 3ZM16.42 19.06H18.16L6.94 4.83H5.07L16.42 19.06Z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}
