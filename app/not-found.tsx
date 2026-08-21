import Link from "next/link";

// Root-level fallback for URLs that fall outside any /ar or /en segment
// (e.g. a broken asset path). The [locale] segment provides its own
// branded not-found for everything inside the locale tree; this one has
// no access to providers/fonts, so it stays deliberately minimal.
export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          background: "#0A3D62",
          color: "#ffffff",
        }}
      >
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#F5A623", marginBottom: 12 }}>
            404
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            Page not found
          </h1>
          <Link href="/" style={{ color: "#F5A623", fontWeight: 600 }}>
            Back to GoMadar.sa →
          </Link>
        </div>
      </body>
    </html>
  );
}
