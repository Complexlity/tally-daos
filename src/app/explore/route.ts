import { getActiveProposals } from "@/utils/getActiveProposals";
import { getActiveProposalOrganizations } from "@/utils/getActiveProposalsOrganizations";
import { getFrameHtml } from "@/utils/getFrameHtmlWithState";
import { PickedOrgs } from "@/utils/types";
import { Frame, FrameButton } from "frames.js";
import { NextRequest, NextResponse } from "next/server";
import dummyState from "@/utils/dummyState.json";

// Opt out of caching for all data requests in the route segment
type State = PickedOrgs;

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
      let startState =
        (await getActiveProposalOrganizations()) as unknown as State;
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
    const current = activeProposals[state.next];
    const next = activeProposals[state.next + 1];

    let imageUrl = `${process.env.HOST}/images/explore?page=proposals&curr=${next}`;
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
  if (!serializedState) {
    // state =
    //   JSON.parse(decodeURIComponent(dummyState[0])) as unknown as State
    state = (await getActiveProposalOrganizations()) as unknown as State;
  } else {
    state = JSON.parse(decodeURIComponent(serializedState)) as unknown as State;
  }


  let imageUrl: string;
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

    const current = state[inputTextNumber - 1];
    let chainId = current.governances[0].id.split(":").slice(0, 2).join(":");

    const currentGovernanceIds = current.governances.map((gov) => {
      return gov.id;
    });


    const start = performance.now();
    const activeProposals = await getActiveProposals(
      chainId,
      currentGovernanceIds
    );

    const end = performance.now();
    const time = end - start;
    if (activeProposals.length === 0) {
      let imageUrl = `${process.env.HOST}/images/error`;

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

    imageUrl = `${process.env.HOST}/images/explore?page=review`;
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
