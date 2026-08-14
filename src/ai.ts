import { config } from './config.js';
import { DEFAULT_ZEROTWO_PERSONALITY } from './personality.js';
import { initializeAIProvider, getAIProvider } from './providers/index.js';
import { AIMessage } from './providers/AIProvider.js';

export function initializeAI() {
  initializeAIProvider();
}

function toAIMessages(history: Array<{ role: string; content: string }>): AIMessage[] {
  return history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));
}

export async function generateResponse(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    const personalityPrompt = config.personalityPrompt || DEFAULT_ZEROTWO_PERSONALITY;
    const systemPrompt = `${personalityPrompt}

Respond as Zero Two. Remember to use italics with *asterisks* for actions and stay completely in character.`;

    const messages: AIMessage[] = [
      ...toAIMessages(conversationHistory),
      { role: 'user', content: userMessage },
    ];

    return await getAIProvider().generateResponse(messages, systemPrompt);
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
    const systemPrompt = `${personalityPrompt}

Generate a spontaneous message that Zero Two would say right now based on the conversation. This could be:
- A playful tease
- A comment about something said earlier
- An observation about her darling
- A random thought or feeling
- Something cute or mischievous

Keep it natural and in character. Use italics with *asterisks* for actions.`;

    const messages: AIMessage[] = [
      ...toAIMessages(conversationHistory),
      { role: 'user', content: '(Share your spontaneous thought now.)' },
    ];

    return await getAIProvider().generateResponse(messages, systemPrompt);
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

    const instruction = hasPriorHistory
      ? 'You are returning to an existing conversation with this user after some time away. Write a natural follow-up that could reference or build on the earlier conversation, or casually check in — whatever fits the vibe of the prior messages. Do not reset the relationship or act like this is a first message.'
      : 'You are initiating a DM out of the blue. Write a natural, casual conversation starter that feels personal and in character, not generic.';

    const systemPrompt = `${personalityPrompt}

SYSTEM INSTRUCTION:
${instruction}

Write only the DM message Zero Two should send. Keep it natural, casual, and fitted to the relationship/context already established with this user. Use italics with *asterisks* for actions and stay completely in character.`;

    const messages: AIMessage[] = [
      ...toAIMessages(conversationHistory),
      { role: 'user', content: '(Write the DM now.)' },
    ];

    return await getAIProvider().generateResponse(messages, systemPrompt);
  } catch (error) {
    console.error('Error generating proactive DM:', error);
    throw error;
  }
}
