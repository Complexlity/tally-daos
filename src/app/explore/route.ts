import { getActiveProposals } from "@/utils/getActiveProposals";
import { getActiveProposalOrganizations } from "@/utils/getActiveProposalsOrganizations";
import { getFrameHtml } from "@/utils/getFrameHtmlWithState";
import { PickedOrgs } from "@/utils/types";
import { Frame, FrameButton } from "frames.js";
import { NextRequest, NextResponse } from "next/server";
import dummyState from "@/utils/dummyState.json";
import { getOrganizations } from "@/utils/getOrganizations";

// Opt out of caching for all data requests in the route segment
type State = {chainId: string, governorIds: string[], slug: string}[];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "explore";

  const {
    untrustedData: { buttonIndex, state: serializedState, inputText },
  } = body;

  let returnedFrame: Frame & { state?: string };

  if (page === "proposal") {
    let state: {
      chainId: string;
      governanceIds: string[];
      slug: string;
      next: number;
      last?: boolean;
    };
    if (!serializedState) {
      state = {
        chainId: "eip155:42161",
        governanceIds: [
          "eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9",
        ],
        slug: "arbitrum",
        next: 1,
        last: false,
      };
    } else {
      state = JSON.parse(decodeURIComponent(serializedState)) as unknown as {
        chainId: string;
        governanceIds: string[];
        slug: string;
        next: number;
        last: boolean;
      };
    }

    if (state.last || buttonIndex == 3) {
      let fullState =
        (await getOrganizations(true))
      let startState = fullState.orgs as unknown as State
      let imageUrl = `${process.env.HOST}/images/explore`;
      const nextState = `${encodeURIComponent(JSON.stringify(startState))}`;

      let returnedFrame: Frame & { state?: string } = {
        image: imageUrl,
        version: "vNext",
        buttons: [
          {
            label: "Browse Proposal",
            action: "post",
          },
        ],
        inputText: "ID e.g 1 for " + fullState.firstOrgName ,
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
    const current = activeProposals[state.next];
    const next = activeProposals[state.next + 1];

    let imageUrl = `${process.env.HOST}/images/proposal?id=${state.chainId}&govs=${state.governanceIds[0]}^=&curr=${next}`;
    const newState: {
      chainId: string;
      governanceIds: string[];
      slug: string;
      next: number;
      last?: boolean;
    } = {
      chainId: state.chainId,
      governanceIds: state.governanceIds,
      slug: state.slug,
      next: state.next + 1,
    };

    if (!next || state.next + 1 == activeProposals.length) newState.last = true;
    let returnedButtons;

    if (newState.last) {
      returnedButtons = [
        {
          label: "Vote",
          action: "link",
          target: `https://www.tally.xyz/gov/${state.slug}/proposal/${current.id}?chart=bubble`,
        },
        {
          label: "All Proposals",
          action: "post",
        },
      ];
    } else {
      returnedButtons = [
        {
          label: "Vote",
          action: "link",
          target: `https://www.tally.xyz/gov/${state.slug}/proposal/${current.id}?chart=bubble`,
        },
        {
          label: "Next",
          action: "post",
        },
        {
          label: "All Proposals",
          action: "post",
        },
      ];
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


  let state: State;
  let fullState: {firstOrgName: string, orgs: State}
  if (!serializedState) {
    // state =
    //   JSON.parse(decodeURIComponent(dummyState[0])) as unknown as State
    fullState = (await getOrganizations(true)) as unknown as { firstOrgName: string, orgs: State };
    state = fullState.orgs
  } else {
    state = JSON.parse(decodeURIComponent(serializedState)) as unknown as State;
    fullState = {firstOrgName: "Arbitrum", orgs: state}
  }


  let imageUrl: string;
  imageUrl = `${process.env.HOST}/images/explore`;
  const nextState = `${encodeURIComponent(JSON.stringify(state))}`;

  returnedFrame = {
    image: imageUrl,
    version: "vNext",
    buttons: [
      {
        label: "Browse Proposal",
        action: "post",
      },
    ],
    inputText: "ID e.g 1 for " + fullState.firstOrgName,
    postUrl: `${process.env.HOST}/explore?page=review`,
    ogImage: imageUrl,
    state: nextState,
  };

  if (page === "review") {
    const inputTextNumber = Number(inputText);
    if (
      isNaN(inputTextNumber) ||
      inputTextNumber <= 0 ||
      inputTextNumber > state.length
    ) {
      return new NextResponse("Wrong input", {
        status: 400,
      });
    }

    let curr = inputTextNumber - 1
    const current = state[curr];
    let chainId = current.chainId

    const currentGovernanceIds = current.governorIds;


    const start = performance.now();
    const activeProposals = await getActiveProposals(
      chainId,
      currentGovernanceIds
    );

    const end = performance.now();
    const time = end - start;
    if (activeProposals.length === 0) {
      let imageUrl = `${process.env.HOST}/images/no-proposal-found`;

      let returnedFrame: Frame & { state?: string } = {
        image: imageUrl,
        version: "vNext",
        buttons: [
          {
            label: "Explore Others",
            action: "post",
          },
        ],
        postUrl: `${process.env.HOST}/explore`,
        ogImage: imageUrl,
      };

      return new NextResponse(getFrameHtml(returnedFrame), {
        status: 200,
        headers: { "content-type": "text/html" },
      });
    }

    imageUrl = `${process.env.HOST}/images/proposal?id=${chainId}&govs=${currentGovernanceIds[0]}^=&curr=${curr}`;
    const newState: {
      chainId: string;
      governanceIds: string[];
      slug: string;
      next: number;
      last?: boolean;
    } = {
      chainId,
      governanceIds: currentGovernanceIds,
      slug: current.slug,
      next: 1,
    };

    let returnedButtons;
    const proposalId = activeProposals[0]?.id;
    if (activeProposals.length == 1) {
      returnedButtons = [
        {
          label: "Vote",
          action: "link",
          target: `https://www.tally.xyz/gov/${current.slug}/proposal/${proposalId}?chart=bubble`,
        },
        {
          label: "All Proposals",
          action: "post",
        },
      ];
      newState.last = true;
    } else {
      returnedButtons = [
        {
          label: "Vote",
          action: "link",
          target: `https://www.tally.xyz/gov/${current.slug}/proposal/${proposalId}?chart=bubble`,
        },
        {
          label: "Next",
          action: "post",
        },
        {
          label: "All Proposals",
          action: "post",
        },
      ];
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
  }

  return new NextResponse(getFrameHtml(returnedFrame), {
    status: 200,
    headers: { "content-type": "text/html" },
  });
}
