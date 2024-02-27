import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: "black",
          background: "white",
          width: "100%",
          height: "100%",
          padding: "50px 200px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
				<h1>There was no active proposal found </h1>
				<p>Might be due to delayed onchain data syncing</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
