
import { GoogleGenAI, Type } from "@google/genai";
import { CampaignResult, PitchResult, LeadResult, ChatMessage } from "../types";
import { KNOWLEDGE_BASE } from "../data/knowledgeBase";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const retryWithBackoff = async <T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      if (i === maxRetries - 1 || (error?.code !== 503 && error?.status !== 'UNAVAILABLE')) {
        throw error;
      }
      const delay = initialDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
};

export const generateCampaign = async (product: string, audience: string, platform: string): Promise<CampaignResult> => {
  return retryWithBackoff(async () => {
    const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a marketing campaign for:
      Product: ${product}
      Target Audience: ${audience}
      Platform: ${platform}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          objectives: { type: Type.STRING },
          contentIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
          adCopies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                variation: { type: Type.STRING },
                text: { type: Type.STRING }
              },
              required: ["variation", "text"]
            }
          },
          ctas: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["objectives", "contentIdeas", "adCopies", "ctas"]
      }
    }
    });
    return JSON.parse(response.text?.trim() || '{}');
  });
};

export const generatePitch = async (product: string, persona: string, industry: string): Promise<PitchResult> => {
  return retryWithBackoff(async () => {
    const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a sales pitch for:
      Product: ${product}
      Customer Persona: ${persona}
      Industry: ${industry}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          elevatorPitch: { type: Type.STRING },
          valueProposition: { type: Type.STRING },
          differentiators: { type: Type.ARRAY, items: { type: Type.STRING } },
          callToAction: { type: Type.STRING }
        },
        required: ["elevatorPitch", "valueProposition", "differentiators", "callToAction"]
      }
    }
    });
    return JSON.parse(response.text?.trim() || '{}');
  });
};

export const scoreLead = async (name: string, budget: string, need: string, urgency: string): Promise<LeadResult> => {
  return retryWithBackoff(async () => {
    const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Score this sales lead:
      Lead Name: ${name}
      Budget Info: ${budget}
      Business Need: ${need}
      Urgency Level: ${urgency}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
          probabilityOfConversion: { type: Type.NUMBER },
          recommendedActions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "reasoning", "probabilityOfConversion", "recommendedActions"]
      }
    }
    });
    return JSON.parse(response.text?.trim() || '{}');
  });
};

export const askChatbot = async (query: string, history: ChatMessage[]): Promise<string> => {
  return retryWithBackoff(async () => {
    // RAG: Filter context based on simple keyword matching to simulate 'Retrieval'
    const relevantContext = KNOWLEDGE_BASE.filter(k => 
      query.toLowerCase().includes(k.topic.toLowerCase().split(' ')[0]) ||
      k.content.toLowerCase().includes(query.toLowerCase().split(' ')[0])
    );

    const contextStr = relevantContext.length > 0 
      ? relevantContext.map(k => `[SOURCE: ${k.topic}] ${k.content}`).join("\n\n")
      : KNOWLEDGE_BASE.map(k => `${k.topic}: ${k.content}`).join("\n\n");
  
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Changed from pro to flash for consistency
      contents: [
        { role: 'user', parts: [{ text: `You are the MarketAI Expert Assistant. You provide high-level advice on sales and marketing.

      Your knowledge base contains the following specific information:
      ${contextStr}

      IMPORTANT FORMATTING RULES:
      - Use clear line breaks between sections (add blank lines)
      - Use bullet points (* or -) for lists, with each point on a NEW LINE
      - Use numbered lists (1., 2., 3.) when showing steps or priorities
      - Use ## for main headings and ### for subheadings
      - Use **bold** for emphasis on key terms
      - Keep paragraphs short and separated by blank lines
      - Each bullet point should be on its own line with proper spacing

      Answer the user's question using the formatting rules above. If the information is from the context, mention it professionally. If not, provide your expert general opinion while stating it's not from internal documentation.

      USER QUESTION: ${query}` }]}
      ]
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  });
};
