import { config } from '../config.js';
import { AIProvider, AIMessage } from './AIProvider.js';

interface OllamaChatResponse {
  message?: {
    role: string;
    content: string;
  };
}

export class OllamaProvider implements AIProvider {
  private baseUrl: string;
  private modelName: string;

  constructor() {
    this.baseUrl = config.ollamaBaseUrl;
    this.modelName = config.ollamaModel;

    console.log(`✅ Ollama provider initialized with model: ${this.modelName} (${this.baseUrl})`);
  }

  async generateResponse(messages: AIMessage[], systemPrompt: string): Promise<string> {
    const ollamaMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({ role: msg.role, content: msg.content })),
    ];

    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.modelName,
        messages: ollamaMessages,
        stream: false,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Ollama request failed (${res.status}): ${errorText}`);
    }

    const data = (await res.json()) as OllamaChatResponse;

    if (!data.message?.content) {
      throw new Error('Ollama response did not include message content');
    }

    return data.message.content;
  }
}
