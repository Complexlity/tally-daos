import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          color: "Red",
          background: "white",
          width: "100%",
          height: "100%",
          padding: "50px 200px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: "linear-gradient(to bottom, #fff, #d1a7e2)",
        }}
      >
        No Proposal Found. Might be due to delayed on chain data syncing.
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
