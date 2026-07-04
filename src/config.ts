import dotenv from 'dotenv';

dotenv.config();

export const config = {
  discordToken: process.env.DISCORD_BOT_TOKEN || '',
  googleApiKey: process.env.GOOGLE_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  personalityPrompt: process.env.ZEROTWO_PERSONALITY_PROMPT || '',
  randomMessageChance: parseInt(process.env.RANDOM_MESSAGE_CHANCE || '5', 10),
};

if (!config.discordToken) {
  console.error('❌ DISCORD_BOT_TOKEN is not set in environment variables!');
  console.log('Please add your Discord bot token to the Secrets tab or .env file');
}

if (!config.googleApiKey) {
  console.error('❌ GOOGLE_API_KEY is not set in environment variables!');
  console.log('Please add your Google AI API key to the Secrets tab or .env file');
}
