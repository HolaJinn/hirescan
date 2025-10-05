import axios from "axios"
import { buildJobDescriptionPrompt } from "./jobDescriptionPrompt";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!

export const generateJobFromPromptOpenRouter = async ({
    prompt,
}: {
    prompt: string
}): Promise<{ title: string; description: string }> => {
    const jobPrompt = buildJobDescriptionPrompt(prompt)
    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "x-ai/grok-4-fast:free",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an assistant that writes clear, professional job descriptions. Always return JSON with { title: string, description: string }.",
                    },
                    {
                        role: "user",
                        content: jobPrompt,
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        )

        const raw = response.data?.choices?.[0]?.message?.content?.trim()
        if (!raw) throw new Error("Empty response from OpenRouter AI")

        const parsed = JSON.parse(raw)
        return { title: parsed.title, description: parsed.description }
    } catch (error) {
        console.error("❌ Error generating job via OpenRouter:", error)
        throw new Error("Failed to generate job description.")
    }
}
