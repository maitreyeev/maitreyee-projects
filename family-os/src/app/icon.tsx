import { ImageResponse } from "next/og";
import IndianHomeIcon from "@/components/IndianHomeIcon";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 40,
        }}
      >
        <IndianHomeIcon size={110} />
      </div>
    ),
    { ...size }
  );
}
