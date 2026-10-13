import { ImageResponse } from "next/og";

/**
 * The Lemmory mark (a Σ on a lemon tile) as a PNG, for browser tabs and home screens.
 * The Σ is drawn as lines rather than text so it doesn't depend on a font.
 */
export function appIcon(size: number) {
  const radius = Math.round(size * 0.22);
  return new ImageResponse(
    (
      <div style={{ width: size, height: size, display: "flex", background: "#ffd43b", borderRadius: radius }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          <path d="M70 25 H30 L52 50 L30 75 H70" fill="none" stroke="#0f1121" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
