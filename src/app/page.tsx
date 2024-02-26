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
  postUrl: `${process.env.HOST}/explore`,
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

export default function Page() {
  return (
    <div>
    </div>
  );
}
