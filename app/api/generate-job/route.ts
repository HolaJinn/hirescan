import { generateJobFromPromptOpenRouter } from "@/app/utils/generateJobFromPrompt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const data = await generateJobFromPromptOpenRouter({ prompt });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: "Failed to generate job" }, { status: 500 });
  }
}
