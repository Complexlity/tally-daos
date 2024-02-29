import { getActiveProposals } from "@/utils/getActiveProposals";
import { getOrganizations } from "@/utils/getOrganizations";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chainId = searchParams.get("id") as string;
  const govId = searchParams.get("govs") as string;
  let curr = Number(searchParams.get("curr"));
  if (isNaN(curr)) curr = 0;

  const activeProposals = await getActiveProposals(chainId, [govId]);

  console.log(chainId, govId)
  console.log({ activeProposals })
  console.log({curr})
  const current = activeProposals[Number(curr)];
  console.log({current})



  const colors = {
    FOR: "#15A384",
    AGAINST: "#718096",
    ABSTAIN: "F44061",
  };

  //@ts-expect-error
  function getSupport(voteStats) {
    // Find the item with the highest number of votes
    //@ts-expect-error
    const maxVotesItem = voteStats.reduce((maxVotes, current) => {
      return current.votes > maxVotes.votes ? current : maxVotes;
    });

    // Return the support value of the item with the highest votes
    return maxVotesItem.support;
  }




  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          backgroundImage: "linear-gradient(to bottom, #fff, #d1a7e2)",
          fontWeight: 600,
          fontSize: 30,
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1 tw="font-bold">{current.title}</h1>
        <div tw="flex px-8 py-4 w-[80%]">
          <span
            tw={`w-[${current.voteStats[0].percent}%] rounded-l-full bg-[#15A384]`}
          >
            .
          </span>
          <span tw={`w-[${current.voteStats[2].percent}%] bg-[#718096]`}></span>
          <span
            tw={`rounded-r-full w-[${current.voteStats[1].percent}%] bg-[#F44061]`}
          ></span>
        </div>
        <div tw="flex items-center text-4xl m-5">
          Current Majority Support:
          <span
            //@ts-expect-error
            tw={`text-[${colors[getSupport(current.voteStats)]}] mx-4 text-6xl`}
          >
            {getSupport(current.voteStats)}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
