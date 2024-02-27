import { getActiveProposalOrganizations } from "@/utils/getActiveProposalsOrganizations";
import { Frame, getFrameFlattened } from "frames.js";
import type { Metadata } from "next";

// Declare the frame
const initialFrame: Frame = {
  image: `${process.env.HOST}/images/start`,
  version: "vNext",
  buttons: [
    {
      label: "Explore",
      action: "post",
    },
  ],
  postUrl: `${process.env.HOST}/explore?page=explore`,
};

// Export Next.js metadata
export const metadata: Metadata = {
  title: "Explore Active Proposals",
  description: "Find all active dao proposals",
  openGraph: {
    images: [
      {
        url: `${process.env.HOST}/images/explore`,
      },
    ],
  },
  other: getFrameFlattened(initialFrame),
};

export default async function Page() {
  const proposals = await getActiveProposalOrganizations();
  return <div>{JSON.stringify(proposals)}</div>;
}
