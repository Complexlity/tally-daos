import { Frame, getFrameHtml } from "frames.js";
import { NextRequest, NextResponse } from "next/server";

// Opt out of caching for all data requests in the route segment

const startImageUrl = `${process.env.HOST}/images/start`;

const initialFrame: Frame = {
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
};


export async function POST(request: NextRequest) {
  const body = await request.json();
  const buttonId = body.untrustedData.buttonIndex;
  const inputText = body.untrustedData.inputText;

  const inputTextAsNumber = Number(inputText);

  return new NextResponse(getFrameHtml(initialFrame), {
        status: 200,
        headers: { "content-type": "text/html" },
      });

}
