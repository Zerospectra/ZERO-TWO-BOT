# Zero Two Discord Bot Project

## Overview
This is a Discord bot featuring Zero Two from "Darling in the FranXX" with AI-powered conversations using Google's Gemini AI. The bot maintains her personality, remembers conversations, and can chat freely in Discord channels or DMs.

## Recent Changes
- **November 24, 2025**: Initial project setup with complete bot implementation
  - Implemented all 5 slash commands (/ping, /activate, /deactivate, /reset, /darlings-thoughts)
  - Added conversation memory system (1000 message history)
  - Integrated Google Gemini AI (gemini-2.5-flash-lite)
  - Set up Do Not Disturb status with custom Rich Presence
  - Created comprehensive personality system for Zero Two

## Project Architecture

### Technology Stack
- **Runtime**: Node.js with TypeScript
- **Discord Library**: Discord.js v14
- **AI Provider**: Google Gemini AI via @google/generative-ai
- **Configuration**: dotenv for environment variables

### Directory Structure
```
├── src/
│   ├── index.ts          # Main bot entry point with Discord client setup
│   ├── config.ts         # Environment configuration management
│   ├── personality.ts    # Zero Two character personality prompt
│   ├── memory.ts         # Conversation memory manager (1000 msg limit)
│   ├── gemini.ts         # Gemini AI integration & response generation
│   └── commands.ts       # Slash command definitions & handlers
├── dist/                 # Compiled JavaScript output
├── attached_assets/      # Bot assets (avatar image)
└── README.md            # User-facing documentation
```

### Key Features
1. **Conversation Memory**: Stores up to 1000 messages per channel/DM for context-aware responses
2. **Channel Activation**: Channels can be activated for free chatting or deactivated for mention-only mode
3. **Multiple Response Triggers**:
   - Always responds to @mentions in servers
   - Always responds to DMs
   - Responds to all messages in activated channels
   - Occasionally sends spontaneous messages in activated channels
4. **Slash Commands**: Five commands for interaction and management
5. **AI Integration**: Uses Gemini AI with a strict in-character personality system

### Configuration (Secrets Tab)
Required secrets:
- `DISCORD_BOT_TOKEN`: Discord bot authentication token
- `GOOGLE_API_KEY`: Google AI Studio API key

Optional configuration:
- `GEMINI_MODEL`: AI model selection (default: gemini-2.5-flash-lite)
- `ZEROTWO_PERSONALITY_PROMPT`: Custom personality override
- `RANDOM_MESSAGE_CHANCE`: Probability (0-100) for spontaneous messages (default: 5)

## Setup Instructions for User

### First Time Setup:
1. **Get Discord Bot Token**:
   - Visit Discord Developer Portal
   - Create application & add bot
   - Enable "Message Content Intent"
   - Copy bot token

2. **Get Google AI API Key**:
   - Visit Google AI Studio
   - Generate API key

3. **Add to Secrets Tab**:
   - Add `DISCORD_BOT_TOKEN` with your Discord token
   - Add `GOOGLE_API_KEY` with your Google AI key

4. **Invite Bot to Server**:
   - Use OAuth2 URL Generator in Discord Developer Portal
   - Select scopes: bot, applications.commands
   - Select permissions: Send Messages, Read Messages, Use Slash Commands, Manage Messages

5. **Run the Bot**:
   - Click the Run button
   - Wait for "🌸 Zero Two Discord Bot Online! 🌸"
   - Bot is ready to use!

## User Preferences
- Language: English
- Character: Zero Two from Darling in the FranXX
- AI Provider: Google Gemini AI (gemini-2.5-flash-lite)
- Status: Do Not Disturb with custom "Thinking about my darling" message

## Notes
- The bot requires both Discord and Google AI credentials to function
- Conversation history is stored in memory (resets on restart)
- The bot uses TypeScript compiled to JavaScript
- All slash commands are registered globally (available in all servers)
