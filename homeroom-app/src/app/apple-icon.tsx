import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2f8f5b",
        }}
      >
        <svg width="104" height="104" viewBox="0 0 64 64" fill="none">
          <path
            d="M32 54V30"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M32 30C32 30 14 30 14 14C30 14 32 30 32 30Z"
            fill="#eaf9ef"
          />
          <path
            d="M32 24C32 24 46 24 46 12C34 12 32 24 32 24Z"
            fill="#c8f0d6"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
