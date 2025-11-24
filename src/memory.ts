interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ConversationData {
  messages: Message[];
  activated: boolean;
}

const MAX_MESSAGES = 1000;

class MemoryManager {
  private conversations: Map<string, ConversationData> = new Map();

  getConversationKey(channelId: string): string {
    return channelId;
  }

  addMessage(channelId: string, role: 'user' | 'assistant', content: string): void {
    const key = this.getConversationKey(channelId);
    
    if (!this.conversations.has(key)) {
      this.conversations.set(key, { messages: [], activated: false });
    }

    const conversation = this.conversations.get(key)!;
    conversation.messages.push({
      role,
      content,
      timestamp: Date.now()
    });

    if (conversation.messages.length > MAX_MESSAGES) {
      conversation.messages = conversation.messages.slice(-MAX_MESSAGES);
    }
  }

  getHistory(channelId: string, limit: number = MAX_MESSAGES): Message[] {
    const key = this.getConversationKey(channelId);
    const conversation = this.conversations.get(key);
    
    if (!conversation) return [];
    
    return conversation.messages.slice(-limit);
  }

  clearHistory(channelId: string): void {
    const key = this.getConversationKey(channelId);
    const conversation = this.conversations.get(key);
    
    if (conversation) {
      conversation.messages = [];
    }
  }

  setActivated(channelId: string, activated: boolean): void {
    const key = this.getConversationKey(channelId);
    
    if (!this.conversations.has(key)) {
      this.conversations.set(key, { messages: [], activated });
    } else {
      this.conversations.get(key)!.activated = activated;
    }
  }

  isActivated(channelId: string): boolean {
    const key = this.getConversationKey(channelId);
    return this.conversations.get(key)?.activated || false;
  }

  hasHistory(channelId: string): boolean {
    const key = this.getConversationKey(channelId);
    const conversation = this.conversations.get(key);
    return conversation ? conversation.messages.length > 0 : false;
  }
}

export const memory = new MemoryManager();
