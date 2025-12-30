import { GenerateCoverLetterRequest, AIProvider, CoverLetterTone } from '../types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export const aiService = {
  async generateCoverLetter(request: GenerateCoverLetterRequest): Promise<string> {
    if (request.aiProvider === 'openai') {
      return this.generateWithOpenAI(request);
    } else {
      return this.generateWithClaude(request);
    }
  },

  async generateWithOpenAI(request: GenerateCoverLetterRequest): Promise<string> {
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, using mock data');
      return this.getMockCoverLetter(request);
    }

    try {
      const prompt = this.buildPrompt(request);

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a professional career coach and expert cover letter writer. Write compelling, tailored cover letters that highlight relevant experience and skills.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI generation error:', error);
      return this.getMockCoverLetter(request);
    }
  },

  async generateWithClaude(request: GenerateCoverLetterRequest): Promise<string> {
    if (!CLAUDE_API_KEY) {
      console.warn('Claude API key not configured, using mock data');
      return this.getMockCoverLetter(request);
    }

    try {
      const prompt = this.buildPrompt(request);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0].text.trim();
    } catch (error) {
      console.error('Claude generation error:', error);
      return this.getMockCoverLetter(request);
    }
  },

  buildPrompt(request: GenerateCoverLetterRequest): string {
    const toneInstructions = {
      professional: 'Use a professional, formal tone. Be respectful and business-appropriate.',
      enthusiastic: 'Use an enthusiastic, passionate tone. Show genuine excitement about the opportunity.',
      technical: 'Use a technical, precise tone. Focus on technical skills and accomplishments.',
    };

    const skillsList = request.userProfile.skills?.join(', ') || 'various technical skills';

    return `Write a compelling cover letter for the following job application:

**Role:** ${request.roleName}
**Company:** ${request.companyName}

**Job Description:**
${request.jobDescription}

**Candidate Profile:**
- Name: ${request.userProfile.full_name || 'the candidate'}
- Summary: ${request.userProfile.summary || 'A motivated professional'}
- Key Skills: ${skillsList}
- Experience: ${request.userProfile.experience || 'Relevant experience in the field'}
- Education: ${request.userProfile.education || 'Strong educational background'}

**Instructions:**
- ${toneInstructions[request.tone]}
- Tailor the cover letter specifically to this role and company
- Highlight relevant skills and experience from the candidate's profile
- Keep it concise (3-4 paragraphs)
- Include a strong opening and closing
- Do NOT include placeholder text like [Your Name] or [Date]
- Write the actual letter content only, no additional commentary

Please write the cover letter now:`;
  },

  getMockCoverLetter(request: GenerateCoverLetterRequest): string {
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `${date}

Dear Hiring Manager,

I am writing to express my strong interest in the ${request.roleName} position at ${request.companyName}. With my background in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.

Throughout my career, I have developed expertise in ${request.userProfile.skills?.slice(0, 3).join(', ') || 'modern web technologies'}, which aligns perfectly with the requirements outlined in your job description. ${request.userProfile.experience || 'My experience has equipped me with the skills necessary to excel in this role.'} I am particularly drawn to ${request.companyName} because of your commitment to innovation and excellence in the industry.

${request.userProfile.summary || 'As a dedicated professional, I am committed to delivering high-quality results and continuously improving my skills.'} I am confident that my technical abilities, combined with my ${request.tone === 'enthusiastic' ? 'passion and enthusiasm' : request.tone === 'technical' ? 'analytical and problem-solving skills' : 'professional approach'}, make me an excellent fit for this position.

I would welcome the opportunity to discuss how my background, skills, and enthusiasms can contribute to ${request.companyName}'s continued success. Thank you for considering my application. I look forward to the possibility of speaking with you soon.

Sincerely,
${request.userProfile.full_name || 'Your Name'}`;
  },
};
