import { ImageResponse } from "next/og";
import IndianHomeIcon from "@/components/IndianHomeIcon";

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
          background: "#1e1b2e",
        }}
      >
        <IndianHomeIcon size={100} />
      </div>
    ),
    { ...size }
  );
}
