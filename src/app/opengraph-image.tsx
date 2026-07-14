import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Aditya — Front-End Developer & UI/UX Designer based in Delhi, India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph / Twitter card preview image (1200×630).
 *
 * Visual design matches the site's brand system:
 *   - Warm cream background (#FAFAF7) — same as site bg-bg-primary
 *   - Near-black typography (#080808) — site text-primary
 *   - Deep maroon accent (#7A1F2B) — site color-maroon, used for the
 *     geometric mark and underline
 *   - Editorial Swiss-grid layout: hairline rules, generous whitespace,
 *     mono-font micro-labels — mirrors the site's design language
 *
 * Route: /opengraph-image (auto-served by Next.js App Router metadata
 * convention). Inherits to all child routes that do not override images.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#FAFAF7",
          color: "#080808",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Maroon geometric accent block — top-right corner mark */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 14,
            height: 220,
            backgroundColor: "#7A1F2B",
          }}
        />

        {/* ─── Top row: micro-label + location ─── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#55514A",
            fontFamily: "monospace",
            fontWeight: 500,
          }}
        >
          <span>Portfolio · 2026</span>
          <span>Delhi · IN</span>
        </div>

        {/* ─── Hero block: name + tagline ─── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            marginTop: -40,
          }}
        >
          {/* Maroon square mark + name row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                backgroundColor: "#7A1F2B",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 132,
                fontWeight: 700,
                lineHeight: 0.95,
                letterSpacing: "-0.045em",
                color: "#080808",
              }}
            >
              Aditya
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginLeft: 56,
            }}
          >
            <span
              style={{
                fontSize: 38,
                fontWeight: 500,
                color: "#080808",
                letterSpacing: "-0.012em",
              }}
            >
              Front-End Developer &amp; UI/UX Designer
            </span>
            <span
              style={{
                fontSize: 24,
                color: "#55514A",
                fontWeight: 400,
                marginTop: 8,
                maxWidth: 900,
                lineHeight: 1.35,
              }}
            >
              Building high-performance digital interfaces with precision
              engineering and intentional design.
            </span>
          </div>
        </div>

        {/* ─── Bottom row: tech marquee + URL ─── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Hairline divider */}
          <div
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "#080808",
              opacity: 0.14,
            }}
          />

          {/* Tech stack row */}
          <div
            style={{
              display: "flex",
              gap: 28,
              fontSize: 20,
              color: "#55514A",
              fontFamily: "monospace",
              letterSpacing: "0.04em",
            }}
          >
            <span>React</span>
            <span style={{ color: "#7A1F2B" }}>◆</span>
            <span>Next.js</span>
            <span style={{ color: "#7A1F2B" }}>◆</span>
            <span>TypeScript</span>
            <span style={{ color: "#7A1F2B" }}>◆</span>
            <span>Three.js</span>
            <span style={{ color: "#7A1F2B" }}>◆</span>
            <span>WebGL</span>
          </div>

          {/* URL + handle */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 26,
              color: "#080808",
              fontWeight: 600,
              fontFamily: "monospace",
            }}
          >
            <span>dev-aditya.com</span>
            <span style={{ color: "#7A1F2B", fontSize: 22 }}>@witejackel</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
