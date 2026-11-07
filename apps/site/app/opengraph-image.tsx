import { ImageResponse } from "next/og";

export const alt = "Lemmory: remember every formula. Know when to use it.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The picture a shared link shows: the homepage's yellow and its headline. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#ffd43b", color: "#0f1121", padding: 72, fontFamily: "serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 40, fontWeight: 700 }}>
          <div style={{ width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", background: "#0f1121", color: "#ffd43b", borderRadius: 8 }}>Σ</div>
          Lemmory
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 88, lineHeight: 1.08, fontWeight: 700 }}>
          <span>Remember every formula.</span>
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>Know when to use it.</span>
        </div>
      </div>
    ),
    size,
  );
}
