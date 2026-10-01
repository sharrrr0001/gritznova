import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RED = "#E10600";

/** Default Open Graph / Twitter card image, generated at build time. */
const fontDir = path.join(process.cwd(), "node_modules/@fontsource/montserrat/files");

export default async function OgImage() {
  const [regular, bold] = await Promise.all([
    readFile(path.join(fontDir, "montserrat-latin-400-normal.woff")),
    readFile(path.join(fontDir, "montserrat-latin-700-normal.woff")),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0A0A0B",
        backgroundImage: "radial-gradient(circle at 88% 18%, rgba(225,6,0,0.32), transparent 42%)",
        color: "#F4F4F5",
        fontFamily: "Montserrat",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <svg width="64" height="64" viewBox="0 0 100 100">
          <defs>
            <mask id="c">
              <rect width="100" height="100" fill="#fff" />
              <polygon points="55,-2 67,50 55,102 63.5,102 75.5,50 63.5,-2" fill="#000" />
            </mask>
          </defs>
          <circle cx="50" cy="50" r="50" fill={RED} mask="url(#c)" />
          <path
            d="M49.6 34.6 A20 20 0 1 0 55.5 51 H38.5"
            fill="none"
            stroke="#fff"
            strokeWidth="9"
          />
        </svg>
        <div style={{ display: "flex", fontSize: 32, letterSpacing: 3, fontWeight: 400 }}>
          <span>GRITZ</span>
          <span style={{ color: RED }}>NOVA</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: 92,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: -1.5,
            maxWidth: 980,
          }}
        >
          <span>Build. Scale.&nbsp;</span>
          <span style={{ color: RED }}>Transform.</span>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: "#A6A6AE" }}
        >
          <svg width="14" height="22" viewBox="0 0 12 20">
            <polygon points="0,0 4.6,0 12,10 4.6,20 0,20 7.4,10" fill={RED} />
          </svg>
          Custom software · AI & ML · Cloud · DevOps
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Montserrat", data: regular, weight: 400, style: "normal" },
        { name: "Montserrat", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
