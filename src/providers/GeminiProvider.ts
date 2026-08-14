import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config.js';
import { AIProvider, AIMessage } from './AIProvider.js';

export class GeminiProvider implements AIProvider {
  private model: any;

  constructor() {
    if (!config.googleApiKey) {
      throw new Error('Google API key not configured');
    }

    const genAI = new GoogleGenerativeAI(config.googleApiKey);
    this.model = genAI.getGenerativeModel({ model: config.geminiModel });

    console.log(`✅ Gemini AI initialized with model: ${config.geminiModel}`);
  }

  async generateResponse(messages: AIMessage[], systemPrompt: string): Promise<string> {
    const historyText = messages
      .map(msg => `${msg.role === 'user' ? 'Darling' : 'Zero Two'}: ${msg.content}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}

CONVERSATION HISTORY:
${historyText}

Zero Two:`;

    const result = await this.model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  }
}
