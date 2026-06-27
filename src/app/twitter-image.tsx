import { ImageResponse } from "next/og"

export const size = {
  width: 1200,
  height: 600,
}

export const contentType = "image/png"

export default function TwitterImage() {
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
          background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 10,
              background: "#fafafa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 22,
              color: "#18181b",
            }}
          >
            SR
          </div>
          <span style={{ fontWeight: 700, fontSize: 28, color: "#fafafa" }}>
            StudyReward
          </span>
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: 42,
            color: "#fafafa",
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          Find Paid Research Opportunities
        </span>
        <span
          style={{
            marginTop: 16,
            fontSize: 20,
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: 600,
          }}
        >
          Clinical Trials · Focus Groups · Product Testing · Medical Studies
        </span>
      </div>
    ),
    { ...size }
  )
}
