import { getActiveProposalOrganizations } from "@/utils/getActiveProposals";
import { Organization } from "@/utils/types";
import { Frame } from "frames.js";
import { getFrameHtml } from "@/utils/getFrameHtmlWithState";
import { NextRequest, NextResponse } from "next/server";
import dummyFrameJson from '@/utils/dummyFrameBody.json'

// Opt out of caching for all data requests in the route segment
type State = {
  page: 'explore' | 'review',
  items: Organization[]
}


export async function POST(request: NextRequest) {
  const {
    untrustedData: { buttonIndex, state: serializedState },
  } = await request.json();

  // const {
  //   //@ts-expect-error
  //   untrustedData: { buttonIndex, state: serializedState },
  // } = dummyFrameJson;

  let state: State

  if(!serializedState){
    const items = await getActiveProposalOrganizations()
    state = {
      page: "explore",
      items
    }
  }
  else {
    state = serializedState
  }



const startImageUrl = `${process.env.HOST}/images/explore`;
  const nextState = `${encodeURIComponent(JSON.stringify(state))}`
  console.log(nextState.length)

const initialFrame: Frame & {state: any} = {
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
  state: nextState
}




  return new NextResponse(getFrameHtml(initialFrame), {
        status: 200,
        headers: { "content-type": "text/html" },
      });

}
