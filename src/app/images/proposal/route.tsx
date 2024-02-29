import { getActiveProposals } from "@/utils/getActiveProposals";
import { getOrganizations } from "@/utils/getOrganizations";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const chainId = searchParams.get('id') as string
  const govId = searchParams.get('govs') as string
  let curr = Number(searchParams.get('curr'))
  if (isNaN(curr)) curr = 0


  const activeProposals = await getActiveProposals(
    chainId,
    [govId]
  );

  console.log(chainId, govId)
  console.log({ activeProposals })
  console.log({curr})
  const current = activeProposals[Number(curr)];
  console.log({current})


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
        {current.title}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
