import { getActiveProposalOrganizations } from "@/utils/getActiveProposalsOrganizations";
import { Organization, PickedOrgs } from "@/utils/types";
import { Frame } from "frames.js";
import { getFrameHtml } from "@/utils/getFrameHtmlWithState";
import { NextRequest, NextResponse } from "next/server";
import dummyFrameJson from "@/utils/dummyFrameBody.json";

// Opt out of caching for all data requests in the route segment
type State = PickedOrgs;

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log({ body });
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "explore";
  const {
    untrustedData: { buttonIndex, state: serializedState },
  } = body;

  // const {
  //   //@ts-expect-error
  //   untrustedData: { buttonIndex, state: serializedState },
  // } = dummyFrameJson;

  console.time("State");
  let state: State = serializedState
    ? JSON.parse(decodeURIComponent(serializedState))
    : await getActiveProposalOrganizations();
  console.timeEnd("State");

  const startImageUrl = `${process.env.HOST}/images/explore`;
  const nextState = `${encodeURIComponent(JSON.stringify(state))}`;
  console.log(nextState.length);

  const initialFrame: Frame & { state: any } = {
    image: startImageUrl,
    version: "vNext",
    buttons: [
      {
        label: "Go",
        action: "post",
      },
    ],
    inputText: "Enter chain number e.g 1, 2, 5",
    postUrl: `${process.env.HOST}/explore`,
    ogImage: startImageUrl,
    state: nextState,
  };

  return new NextResponse(getFrameHtml(initialFrame), {
    status: 200,
    headers: { "content-type": "text/html" },
  });
}
