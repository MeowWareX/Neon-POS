import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top left, rgba(255,79,216,0.48), transparent 30%), linear-gradient(180deg, #0e0221 0%, #090014 100%)",
        color: "#ffffff",
        fontSize: 150,
        fontWeight: 700,
        letterSpacing: "0.2em",
      }}
    >
      <div
        style={{
          display: "flex",
          height: 360,
          width: 360,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 88,
          border: "3px solid rgba(255,255,255,0.14)",
          boxShadow:
            "0 0 60px rgba(255,79,216,0.35), inset 0 0 40px rgba(55,214,255,0.18)",
        }}
      >
        N
      </div>
    </div>,
    size,
  );
}
