export type AIRole = 'user' | 'assistant';

export interface AIMessage {
  role: AIRole;
  content: string;
}

export interface AIProvider {
  generateResponse(messages: AIMessage[], systemPrompt: string): Promise<string>;
}
