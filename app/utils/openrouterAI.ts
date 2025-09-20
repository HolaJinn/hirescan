// /app/utils/openrouterAI.ts
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const SITE_URL = process.env.SITE_URL || "http://localhost:3000"; // optional
const SITE_NAME = process.env.SITE_NAME || "ResumeMatcher"; // optional

// 🧠 Build resume match prompt
export const buildResumeMatchPrompt = (jobDescription: string, resumeText: string): string => {
  return `
You are an HR assistant.

Given the following job description and candidate resume, do the following:

1. Provide a brief assessment of how well this resume matches the job.
2. Highlight key strengths and weaknesses.
3. Assign a match score on a scale from 0 to 100.
4. Extract the candidate's full name from the resume. If not found, return null.

❗️Return your response strictly as a JSON object with the following format:

{
  "summary": "string",
  "keyStrengths": ["string", "string", ...],
  "keyWeaknesses": ["string", "string", ...],
  "score": number,
  "candidateName": "string | null"
}

Job Description:
${jobDescription}

Resume:
${resumeText}
`.trim();
};

// 🚀 AI Call: Get resume match score from OpenRouter DeepSeek
export const getResumeMatchScore = async ({
  jobDescription,
  resumeText,
}: {
  jobDescription: string;
  resumeText: string;
}): Promise<{
  summary: string;
  keyStrengths: string[];
  keyWeaknesses: string[];
  score: number;
  candidateName: string | null;
}> => {
  const prompt = buildResumeMatchPrompt(jobDescription, resumeText);

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "x-ai/grok-4-fast:free",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": SITE_URL,
          "X-Title": SITE_NAME,
          "Content-Type": "application/json",
        },
      }
    );

    const raw = response.data?.choices?.[0]?.message?.content?.trim();

    // Try to extract JSON (sometimes models wrap in ```json ... ```)
    const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : raw;

    const parsed = JSON.parse(jsonString);

    return {
      summary: parsed.summary,
      keyStrengths: parsed.keyStrengths || [],
      keyWeaknesses: parsed.keyWeaknesses || [],
      score: parsed.score,
      candidateName: parsed.candidateName ?? null,
    };
  } catch (error) {
    console.error("❌ Error calling OpenRouter DeepSeek API:", error);
    return {
      summary: "",
      keyStrengths: [],
      keyWeaknesses: [],
      score: 0,
      candidateName: null,
    };
  }
};
