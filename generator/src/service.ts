import { ProfileData, UserData } from './interface';
import { GoogleGenAI } from '@google/genai';

export async function* generateMessageStream(
  user: UserData,
  profile: ProfileData
): AsyncGenerator<string, void, unknown> {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY || '',
    });

    const skillsList =
      profile.skills.length > 0 ? profile.skills.slice(0, 5).join(', ') : 'not specified';

    const prompt = `You are a professional career coach helping write personalized LinkedIn outreach messages.

Write a professional, concise, and personalized outreach message for a LinkedIn connection request or direct message to a recruiter/hiring manager.

User Information:
- Name: ${user.name}
- Current Role: ${user.currentRole}
- Years of Experience: ${user.years} years
- Top Skills: ${user.topSkills}${
      user.keyAchievement ? `\n- Key Achievement: ${user.keyAchievement}` : ''
    }${user.location ? `\n- Location: ${user.location}` : ''}${
      user.portfolioUrl ? `\n- Portfolio: ${user.portfolioUrl}` : ''
    }

Job Information:
- Role: ${profile.role}
- Company: ${profile.company}
- Required Skills: ${skillsList}

Instructions:
1. Keep the message under 200 words
2. Be professional but friendly
3. Highlight relevant experience and skills that match the job requirements
4. If the user has a key achievement, subtly incorporate it if relevant
5. Show genuine interest in the role and company
6. Include a clear call to action
7. Do not use overly formal language
8. Make it personal, not templated
9. If portfolio URL is provided, consider mentioning it naturally
10. Sign off with just the user's name (already provided)

Generate the outreach message now:`;

    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    for await (const chunk of response) {
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error('Error generating message with AI:', error);

    // Fallback to template message if AI fails
    const skills =
      profile.skills.length > 0
        ? `I noticed the role requires ${profile.skills.slice(0, 3).join(', ')}.`
        : '';

    const fallbackMessage = `Hi,

My name is ${user.name}, and I'm a professional with ${user.years} years of experience. I came across the ${profile.role} position at ${profile.company} and I'm very interested in this opportunity.

${skills} I believe my background and skills align well with what you're looking for.

I'd love to discuss how I can contribute to your team. Would you be available for a brief conversation?

Best regards,
${user.name}`;

    yield fallbackMessage;
  }
}
