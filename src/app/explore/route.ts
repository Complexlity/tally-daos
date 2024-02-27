import { getActiveProposals } from "@/utils/getActiveProposals";
import { getActiveProposalOrganizations } from "@/utils/getActiveProposalsOrganizations";
import { getFrameHtml } from "@/utils/getFrameHtmlWithState";
import { PickedOrgs } from "@/utils/types";
import { Frame, FrameButton } from "frames.js";
import { NextRequest, NextResponse } from "next/server";
import dummyState from '@/utils/dummyState.json'

// Opt out of caching for all data requests in the route segment
type State = PickedOrgs;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? 'explore'
  console.log({page})
  const {
    untrustedData: { buttonIndex, state: serializedState, inputText },
  } = body;

  let returnedFrame: Frame & { state?: string };

  if (page === "proposal") {
    console.log("I am in proposal")
    let state: {chainId: string, governanceIds: string[], next: number, last?: boolean}
    if (!serializedState) {
      state = {
        chainId: "eip155:42161",
        governanceIds: [
          "eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9",
        ],
        next: 1,
        last: false
      };
    } else {
      state = JSON.parse(
        decodeURIComponent(serializedState)
      ) as unknown as {chainId: string, governanceIds: string[], next: number, last: boolean};
    }

    console.log({state})

    if (state.last || buttonIndex == 3) {
      console.log("I am the last")
      let startState = (await getActiveProposalOrganizations()) as unknown as State;
      let imageUrl = `${process.env.HOST}/images/explore?page=explore`;
      const nextState = `${encodeURIComponent(JSON.stringify(startState))}`;

      let returnedFrame: Frame & { state?: string } = {
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

      return new NextResponse(getFrameHtml(returnedFrame), {
        status: 200,
        headers: { "content-type": "text/html" },
      });


    }
      const activeProposals = await getActiveProposals(
        state.chainId,
        state.governanceIds
      );
      const current = activeProposals[state.next]
      const next = activeProposals[state.next + 1]

      let imageUrl = `${process.env.HOST}/images/explore?page=proposals&curr=${next}`;
      const newState: { chainId: string, governanceIds: string[], next: number, last?: boolean } = {
        chainId: state.chainId,
        governanceIds: state.governanceIds,
        next: state.next + 1,
      }

      if (!next || state.next + 1 == activeProposals.length) newState.last = true
      let returnedButtons

      if (newState.last) {
        returnedButtons = [
          {
            label: "Vote",
            action: "link",
            target: `https://www.tally.xyz/gov/arbitrum/proposal/${current.id}?chart=bubble`
          },
          {
            label: "All Proposals",
            action: "post"
          }
        ]
      }
      else {
        returnedButtons = [
          {
            label: "Vote",
            action: "link",
            target: `https://www.tally.xyz/gov/arbitrum/proposal/${current.id}?chart=bubble`
          },
          {
            label: "Next",
            action: "post"
          },
          {
            label: "Proposals",
            action: "post"
          }
        ]
      }
      const nextState = `${encodeURIComponent(JSON.stringify(newState))}`;
      returnedFrame = {
        image: imageUrl,
        version: "vNext",
        //@ts-expect-error
        buttons: returnedButtons,
        postUrl: `${process.env.HOST}/explore?page=proposal`,
        ogImage: imageUrl,
        state: nextState,
    };
    return new NextResponse(getFrameHtml(returnedFrame), {
      status: 200,
      headers: { "content-type": "text/html" },
    });
  }

  // const {
  //   //@ts-expect-error
  //   untrustedData: { buttonIndex, state: serializedState },
  // } = dummyFrameJson;

    console.log("I am in explore");

    let state: State
    if (!serializedState) {
      console.log("State not found")
      // state =
      //   JSON.parse(decodeURIComponent(dummyState[0])) as unknown as State
      state = await getActiveProposalOrganizations() as unknown as State;

    }
    else {

      state = JSON.parse(decodeURIComponent(serializedState)) as unknown as State
      console.log("State found")
    }

    console.log({state})

    let imageUrl: string
    console.log("initial state")
    console.log(state)
    imageUrl = `${process.env.HOST}/images/explore?page=explore`;
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



  if (page === "review") {
    console.log("I am review")
    console.log({state})
    const inputTextNumber = Number(inputText)
    console.log({inputTextNumber})
    if (isNaN(inputTextNumber) || inputTextNumber <= 0 || inputTextNumber > state.length) {
      console.log("Wrong input")
      return new NextResponse('Wrong input', {
       status: 400
     })
    }

    const current = state[inputTextNumber - 1]
    console.log({ current })
    let chainId = current.governances[0].id.split(':').slice(0, 2).join(":")
    console.log({chainId})

    const currentGovernanceIds = current.governances.map(gov => {

     return gov.id
    })

    console.log({currentGovernanceIds})

    const start = performance.now()
    const activeProposals = await getActiveProposals(chainId, currentGovernanceIds, true)

    const end = performance.now()
    const time = end - start
    console.log("Time", time)
    console.log({ activeProposals })


    imageUrl = `${process.env.HOST}/images/explore?page=review`;
    const newState: {chainId: string, governanceIds: string[], next: number, last?: boolean} = {
      chainId,
      governanceIds: currentGovernanceIds,
      next: 1,
    }
        const nextState = `${encodeURIComponent(JSON.stringify(newState))}`;
    let returnedButtons;
    if (activeProposals.length == 1) {
      returnedButtons = [
        {
          label: "Vote",
          action: "link",
          target: `https://www.tally.xyz/gov/arbitrum/proposal/${activeProposals[0].id}?chart=bubble`
        },
        {
          label: "All Proposals",
          action: "post"
        }
      ]
      newState.last = true
    }
    else {
      returnedButtons = [
        {
          label: "Vote",
          action: "link",
          target: `https://www.tally.xyz/gov/arbitrum/proposal/${activeProposals[0].id}?chart=bubble`
        },
        {
          label: "Next",
          action: "post"
        },
        {
          label: "Proposals",
          action: "post"
        }
      ]
    }
    returnedFrame = {
      image: imageUrl,
      version: "vNext",
      //@ts-expect-error
      buttons: returnedButtons,

      postUrl: `${process.env.HOST}/explore?page=proposal`,
      ogImage: imageUrl,
      state: nextState,
    };
  }




  return new NextResponse(getFrameHtml(returnedFrame), {
    status: 200,
    headers: { "content-type": "text/html" },
  });
}
