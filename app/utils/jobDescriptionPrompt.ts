export const buildJobDescriptionPrompt = (prompt: string): string => {
  return `
You are an experienced HR specialist.  
Generate a professional job posting for the following role:

Job Title: ${prompt}

Your response **must be valid JSON** in the following format:

{
  "title": "Job title here",
  "description": "Full job description here"
}

The "description" must include:
- Key responsibilities (bullet points, clear and concise)  
- Required qualifications and skills (bullet points)  
- Preferred qualifications (if any, bullet points)  
- Work location and work mode (remote, hybrid, or on-site)  

Important rules:
- Do not add any text outside of the JSON object.  
- Ensure the JSON is valid and parsable.  
- The "title" should be a polished version of the input job title (keep it concise and professional).  
`.trim();
};
