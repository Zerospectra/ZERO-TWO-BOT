import { promises as fs } from 'fs';
import { join } from 'path';

const LOG_DIR = 'conversation-logs';

async function ensureLogDirectory() {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating log directory:', error);
  }
}

function formatTimestamp(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function logConversation(
  username: string,
  userMessage: string,
  botReply: string
): Promise<void> {
  try {
    await ensureLogDirectory();

    const now = new Date();
    const timestamp = formatTimestamp(now);
    const dateStr = formatDate(now);
    
    const logFileName = `${dateStr}.log`;
    const logFilePath = join(LOG_DIR, logFileName);

    const logEntry = `message from "${username}" at ${timestamp} user message= ${userMessage}, bots reply= ${botReply}\n`;

    await fs.appendFile(logFilePath, logEntry, 'utf-8');
  } catch (error) {
    console.error('Error logging conversation:', error);
  }
}
