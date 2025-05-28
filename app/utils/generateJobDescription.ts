import axios from 'axios'
import { buildJobDescriptionPrompt } from './jobDescriptionPrompt'

const EDEN_API_KEY = process.env.EDEN_API_KEY!
const GENI_ID = 'da48910f-8ae2-4704-b5fb-f484f5efcec4'

export const generateJobDescription = async ({
    jobTitle,
}: {
    jobTitle: string
}): Promise<string> => {
    const prompt = buildJobDescriptionPrompt(jobTitle)

    try {
        const response = await axios.post(
            'https://edenportal.eden-genai.com/eden/ask',
            {
                geniId: GENI_ID,
                language: 'en',
                usage: true,
                prompt,
            },
            {
                headers: {
                    'api-key': EDEN_API_KEY,
                    'Content-Type': 'application/json',
                },
            }
        )

        const raw = response.data?.response?.trim()

        if (!raw) {
            throw new Error('Empty response from Eden AI')
        }

        return raw
    } catch (error) {
        console.error('❌ Error generating job description via Eden AI:', error)
        throw new Error('Failed to generate job description.')
    }
}
