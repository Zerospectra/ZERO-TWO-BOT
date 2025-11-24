import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './config.js';
import { DEFAULT_ZEROTWO_PERSONALITY } from './personality.js';

let genAI: GoogleGenerativeAI;
let model: any;

export function initializeGemini() {
  if (!config.googleApiKey) {
    throw new Error('Google API key not configured');
  }

  genAI = new GoogleGenerativeAI(config.googleApiKey);
  model = genAI.getGenerativeModel({ model: config.geminiModel });
  
  console.log(`✅ Gemini AI initialized with model: ${config.geminiModel}`);
}

export async function generateResponse(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    const personalityPrompt = config.personalityPrompt || DEFAULT_ZEROTWO_PERSONALITY;
    
    const historyText = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'Darling' : 'Zero Two'}: ${msg.content}`)
      .join('\n');

    const fullPrompt = `${personalityPrompt}

CONVERSATION HISTORY:
${historyText}

Current message from darling: ${userMessage}

Respond as Zero Two. Remember to use italics with *asterisks* for actions and stay completely in character:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

export async function generateRandomThought(
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    const personalityPrompt = config.personalityPrompt || DEFAULT_ZEROTWO_PERSONALITY;
    
    const historyText = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'Darling' : 'Zero Two'}: ${msg.content}`)
      .join('\n');

    const fullPrompt = `${personalityPrompt}

CONVERSATION HISTORY:
${historyText}

Generate a spontaneous message that Zero Two would say right now based on the conversation. This could be:
- A playful tease
- A comment about something said earlier
- An observation about her darling
- A random thought or feeling
- Something cute or mischievous

Keep it natural and in character. Use italics with *asterisks* for actions:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating random thought:', error);
    throw error;
  }
}
