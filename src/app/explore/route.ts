import { getActiveProposals } from "@/utils/getActiveProposals";
import { getActiveProposalOrganizations } from "@/utils/getActiveProposalsOrganizations";
import { getFrameHtml } from "@/utils/getFrameHtmlWithState";
import { PickedOrgs } from "@/utils/types";
import { Frame } from "frames.js";
import { NextRequest, NextResponse } from "next/server";

// Opt out of caching for all data requests in the route segment
type State = PickedOrgs;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page")
  console.log({page})
  const {
    untrustedData: { buttonIndex, state: serializedState, inputText },
  } = body;

  // const {
  //   //@ts-expect-error
  //   untrustedData: { buttonIndex, state: serializedState },
  // } = dummyFrameJson;
  let state: State
  if (!serializedState) {
    console.log("State not found")
  state = await getActiveProposalOrganizations() as unknown as State;
  }
  else {

    state = JSON.parse(decodeURIComponent(serializedState)) as unknown as State
    console.log("State found")
  }



  let imageUrl: string
  let returnedFrame: Frame & {state? : any}

  if (page === "explore") {
    console.log("initial state")
    console.log(state)
    imageUrl = `${process.env.HOST}/images/explore?page=review`;
    const nextState = `${encodeURIComponent(JSON.stringify(state))}`;


     returnedFrame = {
    image: imageUrl,
    version: "vNext",
    buttons: [
      {
        label: "Go",
        action: "post",
      },
    ],
    inputText: "Enter chain number e.g 1, 2, 5",
    postUrl: `${process.env.HOST}/explore?page=review`,
    ogImage: imageUrl,
    state: nextState,
    };



  }

  else if (page === "review") {
    console.log("I am review")
    const inputTextNumber = Number(inputText)
    console.log({inputTextNumber})
    if (isNaN(inputTextNumber) || inputTextNumber <= 0 || inputTextNumber > state.length) {
      console.log("Wrong input")
      return new NextResponse('Wrong input', {
       status: 400
     })
    }
    console.log("review State")
    console.log(state)
    console.log(state)
    const current = state[inputTextNumber - 1]
    console.log({ current })
    let chainId = current.governances[0].id.split(':').slice(0, 2).join(":")
    console.log({chainId})

    const currentGovernanceIds = current.governances.map(gov => {

     return gov.id
    })

    console.log({currentGovernanceIds})

    const activeProposals = await getActiveProposals(chainId, currentGovernanceIds)
    console.log({ activeProposals })
  }




  return new NextResponse(getFrameHtml(returnedFrame), {
    status: 200,
    headers: { "content-type": "text/html" },
  });
}
