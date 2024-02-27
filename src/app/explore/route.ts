import { Frame, getFrameHtml } from "frames.js";
import { NextRequest, NextResponse } from "next/server";

// Opt out of caching for all data requests in the route segment



export async function POST(request: NextRequest) {


const startImageUrl = `${process.env.HOST}/images/explore`;

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




  return new NextResponse(getFrameHtml(initialFrame), {
        status: 200,
        headers: { "content-type": "text/html" },
      });

}
