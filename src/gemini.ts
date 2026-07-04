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

export async function generateProactiveDM(
  conversationHistory: Array<{ role: string; content: string }>,
  hasPriorHistory: boolean
): Promise<string> {
  try {
    const personalityPrompt = config.personalityPrompt || DEFAULT_ZEROTWO_PERSONALITY;
    
    const historyText = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'Darling' : 'Zero Two'}: ${msg.content}`)
      .join('\n');

    const systemInstruction = hasPriorHistory
      ? 'You are returning to an existing conversation with this user after some time away. Write a natural follow-up that could reference or build on the earlier conversation, or casually check in — whatever fits the vibe of the prior messages. Do not reset the relationship or act like this is a first message.'
      : 'You are initiating a DM out of the blue. Write a natural, casual conversation starter that feels personal and in character, not generic.';

    const fullPrompt = `${personalityPrompt}

CONVERSATION HISTORY:
${historyText || '(No prior conversation with this user.)'}

SYSTEM INSTRUCTION:
${systemInstruction}

Write only the DM message Zero Two should send. Keep it natural, casual, and fitted to the relationship/context already established with this user. Use italics with *asterisks* for actions and stay completely in character:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating proactive DM:', error);
    throw error;
  }
}