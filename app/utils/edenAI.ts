import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const EDEN_API_KEY = process.env.EDEN_API_KEY!;
const GENI_ID = 'da48910f-8ae2-4704-b5fb-f484f5efcec4'; // you can parameterize this later if needed

const edenClient = axios.create({
    baseURL: 'https://edenportal.eden-genai.com/eden/ask',
    headers: {
        'api-key': EDEN_API_KEY,
        'Content-Type': 'application/json',
    },
});

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

// 🚀 AI Call: Get resume match score
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
        const response = await edenClient.post('', {
            geniId: GENI_ID,
            language: 'en',
            usage: true,
            prompt,
        });

        console.log(response.data);
        const raw = response.data?.response?.trim();
        const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/);
        if (!jsonMatch || !jsonMatch[1]) {
            throw new Error('Failed to extract JSON from response');
        }

        const parsed = JSON.parse(jsonMatch[1]);
        return {
            summary: parsed.summary,
            keyStrengths: parsed.keyStrengths,
            keyWeaknesses: parsed.keyWeaknesses,
            score: parsed.score,
            candidateName: parsed.candidateName ?? null,
        };
    } catch (error) {
        console.error('❌ Error calling Eden AI for resume match:', error);
        return {
            summary: '',
            keyStrengths: [],
            keyWeaknesses: [],
            score: 0,
            candidateName: null,
        };
    }
};
