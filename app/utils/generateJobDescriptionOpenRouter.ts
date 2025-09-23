// app/utils/generateJobDescriptionOpenRouter.ts
import axios from "axios";
import { buildJobDescriptionPrompt } from "./jobDescriptionPrompt";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;

export const generateJobDescriptionOpenRouter = async ({
  jobTitle,
}: {
  jobTitle: string;
}): Promise<string> => {
  const prompt = buildJobDescriptionPrompt(jobTitle);

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.3-70b-instruct:free", 
        messages: [
          {
            role: "system",
            content: "You are an assistant that writes clear, professional job descriptions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const raw = response.data?.choices?.[0]?.message?.content?.trim();

    if (!raw) {
      throw new Error("Empty response from OpenRouter AI");
    }

    return raw;
  } catch (error) {
    console.error("❌ Error generating job description via OpenRouter:", error);
    throw new Error("Failed to generate job description.");
  }
};
