import { config } from '../config.js';
import { AIProvider } from './AIProvider.js';
import { GeminiProvider } from './GeminiProvider.js';
import { OllamaProvider } from './OllamaProvider.js';

let activeProvider: AIProvider | undefined;

export function initializeAIProvider(): AIProvider {
  activeProvider = config.aiProvider === 'ollama' ? new OllamaProvider() : new GeminiProvider();

  const label = config.aiProvider === 'ollama' ? 'OLLAMA (local)' : 'GEMINI (cloud)';
  console.log(`🌸 Zero Two is running with: ${label}`);

  return activeProvider;
}

export function getAIProvider(): AIProvider {
  if (!activeProvider) {
    throw new Error('AI provider not initialized. Call initializeAIProvider() first.');
  }
  return activeProvider;
}
