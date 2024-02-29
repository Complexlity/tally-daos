import { getOrganizations } from "@/utils/getOrganizations";
import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET() {
  const activeProposalOrganizations = await getOrganizations()
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          fontWeight: 600,
          fontSize: 30,
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", width: "100%" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              backgroundImage: "linear-gradient(to bottom, #000000, #923CB5)",
              color: "white",
              padding: "0.5rem",
              fontWeight: "600",
            }}
          >
            <span style={{ flex: "1" }}>ID</span>
            <span style={{ flex: "1" }}>Governance</span>
            <span style={{ flex: "1" }}>Total Votes</span>
            <span style={{ flex: "1" }}>Active Proposals</span>
          </div>
          {/* Data Row */}
          {/* @ts-expect-error */}
          {activeProposalOrganizations.map((proposal, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                padding: "0.5rem",
                borderTop: "1px solid #E2E8F0",
              }}
            >
              <span style={{ flex: "1" }}>{index + 1}</span>
              <span style={{ flex: "1", alignItems: "center", gap: "4px" }}>
                <div
                  style={{
                    display: "flex",
                    width: "30px",
                    height: "30px",
                    overflow: "hidden",
                    borderRadius: "100%",
                  }}
                >
                  <img
                    src={proposal.metadata.icon!}
                    width={"100%"}
                    height={"100%"}
                  />
                </div>
                <span>{proposal.name}</span>
              </span>
              <span style={{ flex: "1" }}>{proposal.votersCount}</span>
              <span style={{ flex: "1" }}>{proposal.activeProposalsCount}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            width: "100%",
            display: "none",
            justifyContent: "center",
            padding: "4px",
            gap: "2px",
            position: "absolute",
            bottom: 0,
            fontSize: 28,
          }}
        >
          Enter ID in the input and click <span> GO </span> to browse
        </div>
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
