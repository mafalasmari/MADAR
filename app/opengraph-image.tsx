import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A3D62",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 108, fontWeight: 900, color: "#FFFFFF", letterSpacing: -4 }}>
          MADAR
        </div>
        <svg width="260" height="52" viewBox="0 0 900 180" style={{ marginTop: 4 }}>
          <path d="M 60 90 Q 450 190 840 90" fill="none" stroke="#1B75BB" strokeWidth={18} strokeLinecap="round" />
          <circle cx={60} cy={90} r={18} fill="#F5A623" />
          <path d="M 840 90 L 795 72 M 840 90 L 812 128" fill="none" stroke="#1B75BB" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#9DB1C0" }}>
          Where food trade moves
        </div>
      </div>
    ),
    { ...size },
  );
}
