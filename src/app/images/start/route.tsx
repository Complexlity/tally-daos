import { getActiveProposals } from "@/utils/getActiveProposals";
import { getActiveProposalOrganizations } from "@/utils/getActiveProposalsOrganizations";
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
          display: "flex",
          color: "black",
          background: "white",
          width: "100%",
          height: "100%",
          padding: "50px 5px",
          textAlign: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(to bottom, #fff, #d1a7e2)",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
            fontSize: "60px",
          }}
        >
          <span
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))",
              backgroundClip: "text",
              //@ts-ignore
              "-webkit-background-clip": "text",
              color: "transparent",
            }}
          >
            Explore
          </span>
          <span>Open DAO proposals on</span>
          <img src={`${process.env.HOST}/tally.png`} width={210} height={70} />
        </div>
        <p>Make Your Vote Count!</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, s-maxage=1",
        "CDN-Cache-Control": "public, s-maxage=60",
        "Vercel-CDN-Cache-Control": "public, s-maxage=3600",
      },
    }
  );
}
