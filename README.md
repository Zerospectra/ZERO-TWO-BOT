# 🌸 Zero Two Discord Bot

An AI-powered Discord bot featuring **Zero Two** from *Darling in the FranXX*, powered by Google's Gemini AI. She stays completely in character, remembers conversations, and can chat freely in your Discord server!

## ✨ Features

- **🎭 Authentic Zero Two Personality**: Strict in-character responses with her signature speech patterns and behavior
- **💭 Conversation Memory**: Remembers up to 1000 messages per channel/DM for contextual conversations
- **💬 Multiple Chat Modes**:
  - Responds to @mentions anywhere
  - Replies to all DMs automatically
  - Can be activated to chat freely in specific channels
  - Sometimes sends spontaneous messages (when activated)
- **🎯 Slash Commands**: Easy-to-use commands for interaction
- **🔴 Custom Status**: "Do Not Disturb" with "𝓣𝓱𝓲𝓷𝓴𝓲𝓷𝓰 𝓪𝓫𝓸𝓾𝓽 𝓶𝔂 𝓭𝓪𝓻𝓵𝓲𝓷𝓰"
- **⚙️ Fully Configurable**: Customize personality, model, and behavior via environment variables

## 🚀 Setup Instructions

### 1. Get Your Credentials

#### Discord Bot Token:
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and name it (e.g., "Zero Two")
3. Go to the "Bot" tab and click "Add Bot"
4. Under "Privileged Gateway Intents", enable:
   - ✅ Message Content Intent
   - ✅ Server Members Intent (optional)
5. Click "Reset Token" and copy your bot token
6. **Save this token** - you'll need it for the Secrets tab

#### Google AI API Key:
1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy your API key
4. **Save this key** - you'll need it for the Secrets tab

### 2. Configure the Bot on Replit

1. Go to the **Secrets** tab (🔒 icon in the left sidebar)
2. Add the following secrets:

   | Key | Value |
   |-----|-------|
   | `DISCORD_BOT_TOKEN` | Your Discord bot token |
   | `GOOGLE_API_KEY` | Your Google AI API key |

**Optional Configuration** (add to Secrets tab if desired):
- `GEMINI_MODEL` - The Gemini model to use (default: `gemini-2.5-flash`)
- `ZEROTWO_PERSONALITY_PROMPT` - Custom personality prompt (optional - default included)
- `RANDOM_MESSAGE_CHANCE` - Chance (0-100) for spontaneous messages (default: `5`)

### 3. Invite the Bot to Your Server

1. In Discord Developer Portal, go to "OAuth2" → "URL Generator"
2. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select bot permissions:
   - ✅ Send Messages
   - ✅ Read Messages/View Channels
   - ✅ Read Message History
   - ✅ Use Slash Commands
   - ✅ Manage Messages (for /activate and /deactivate commands)
4. Copy the generated URL and open it in your browser
5. Select your server and authorize the bot

### 4. Run the Bot

1. Click the **Run** button at the top of Replit
2. Wait for the bot to compile and start
3. You should see: `🌸 Zero Two Discord Bot Online! 🌸`
4. The bot is now ready to use!

## 📝 Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/ping` | Check Zero Two's response time | `/ping` |
| `/activate` | Let Zero Two chat freely in the current channel | `/activate` |
| `/deactivate` | Stop Zero Two from chatting freely in the channel | `/deactivate` |
| `/reset` | Clear Zero Two's memory of the conversation | `/reset` |
| `/darlings-thoughts` | Zero Two shares her current thoughts based on chat history | `/darlings-thoughts` |

## 💬 How to Chat with Zero Two

### In Servers:
- **@mention her**: `@Zero Two hello!` - She'll respond to mentions anywhere
- **Use /activate**: In any channel, use `/activate` to let her chat freely
  - She'll respond to messages in that channel
  - She might occasionally send spontaneous messages
  - Use `/deactivate` to stop free chatting

### In DMs:
- Just send her a message! She always responds to DMs

## 🎨 Customization

### Custom Personality Prompt
Add a `ZEROTWO_PERSONALITY_PROMPT` secret with your custom prompt to modify her behavior while keeping her in character.

### Model Selection
Change the `GEMINI_MODEL` secret to use different Gemini models:
- `gemini-2.5-flash` (default - fast and efficient)
- `gemini-2.0-flash-exp` (experimental)
- `gemini-1.5-pro` (more capable, slower)

### Spontaneous Message Frequency
Adjust `RANDOM_MESSAGE_CHANCE` (0-100) to control how often Zero Two sends random messages in activated channels.

## 🛠️ Technical Details

- **Framework**: Discord.js v14
- **AI Model**: Google Gemini AI (configurable)
- **Language**: TypeScript
- **Memory**: 1000 messages per channel/DM
- **Status**: Do Not Disturb with custom activity

## 📋 Project Structure

```
├── src/
│   ├── index.ts          # Main bot entry point
│   ├── config.ts         # Configuration management
│   ├── personality.ts    # Zero Two personality prompt
│   ├── memory.ts         # Conversation memory system
│   ├── gemini.ts         # Gemini AI integration
│   └── commands.ts       # Slash command handlers
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## 🐛 Troubleshooting

### Bot doesn't respond:
- Check that both `DISCORD_BOT_TOKEN` and `GOOGLE_API_KEY` are set in the Secrets tab
- Make sure the bot has the "Message Content Intent" enabled in Discord Developer Portal
- Verify the bot has permissions to read and send messages in the channel

### Commands don't appear:
- Wait a few minutes for Discord to register the commands
- Try using the command with `/` - Discord should show autocomplete

### Bot goes offline:
- Check the console logs for errors
- Make sure your Replit is running and not sleeping

## 📄 License

MIT License - Feel free to modify and use as you wish!

---

*Made with 💕 for Zero Two fans*
