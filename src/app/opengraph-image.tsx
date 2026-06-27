import { ImageResponse } from "next/og"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function OpenGraphImage() {
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
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 12,
              background: "#fafafa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 28,
              color: "#18181b",
            }}
          >
            SR
          </div>
          <span style={{ fontWeight: 700, fontSize: 36, color: "#fafafa" }}>
            StudyReward
          </span>
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: 56,
            color: "#fafafa",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Find Paid Research<br />Opportunities in the US
        </span>
        <span
          style={{
            marginTop: 20,
            fontSize: 24,
            color: "#a1a1aa",
            textAlign: "center",
          }}
        >
          Clinical Trials · Focus Groups · Product Testing · Medical Studies
        </span>
      </div>
    ),
    { ...size }
  )
}
