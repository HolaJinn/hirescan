export const buildJobDescriptionPrompt = (jobTitle: string): string => {
    return `
You are an HR specialist.

Generate a detailed job description for the following job title:

Job Title: ${jobTitle}

Make sure the description includes:
1. Key responsibilities (in bullet points)
2. Required qualifications and skills (in bullet points)
3. Preferred qualifications (if any)
4. Work location and work mode (remote, hybrid, on-site)

I want you to only provide the response and nothing more.
Respond with only the job description as plain text, no markdown or formatting. Do not include anything outside of the description itself.
  `.trim();
};
