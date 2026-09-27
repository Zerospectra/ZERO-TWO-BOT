# Zero Two Discord Bot

A Discord bot that plays Zero Two from *Darling in the FranXX*. She talks in character, remembers what you said, and hangs out in your server or your DMs. Replies come from Google Gemini or from a local model through Ollama.

## What she does

- Replies when you @mention her, and replies to every DM.
- Talks freely in any channel where you run `/activate`.
- Now and then jumps into a conversation in other channels on her own.
- Once in a while, DMs someone who has been active in the server. This is rare on purpose.
- Remembers the last 1000 messages per channel or DM. The memory is in RAM, so it resets when the bot restarts.
- Logs every conversation to `conversation-logs/<date>.log`.
- Shows as Do Not Disturb with the status "𝓣𝓱𝓲𝓷𝓴𝓲𝓷𝓰 𝓪𝓫𝓸𝓾𝓽 𝓶𝔂 𝓭𝓪𝓻𝓵𝓲𝓷𝓰".

## Commands

| Command | What it does |
|---------|--------------|
| `/ping` | Shows her response time. |
| `/activate` | Lets her talk freely in the current channel. Needs Manage Messages. |
| `/deactivate` | Stops her talking freely in the channel. Needs Manage Messages. |
| `/reset` | Clears her memory of the conversation in the channel. |
| `/darlings-thoughts` | She says what is on her mind, based on the chat so far. |
| `/dm <user>` | She sends that user a private message. Only you see the confirmation. |

## Setup

### 1. Get a Discord bot token

1. Open the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.
2. In the **Bot** tab, turn on **Message Content Intent**. Without it, the bot cannot log in.
3. Click **Reset Token** and copy the token.

### 2. Pick an AI provider

- **Gemini:** get a key from [Google AI Studio](https://aistudio.google.com/apikey). The free tier has low limits (about 20 requests a day for `gemini-2.5-flash`), so a busy server runs out fast.
- **Ollama:** install [Ollama](https://ollama.com) and pull a model. It is free and has no limits, but it runs on your own PC.

### 3. Fill in `.env`

Copy `.env.example` to `.env` and set:

| Key | Value |
|-----|-------|
| `DISCORD_BOT_TOKEN` | Your bot token |
| `AI_PROVIDER` | `gemini` or `ollama` (default: `gemini`) |
| `GOOGLE_API_KEY` | Your Gemini key (only for Gemini) |
| `GEMINI_MODEL` | Default: `gemini-2.5-flash` |
| `OLLAMA_MODEL` | The name of a model you pulled (default: `llama3`) |
| `OLLAMA_BASE_URL` | Default: `http://localhost:11434` |

Optional settings:

| Key | What it does |
|-----|--------------|
| `ZEROTWO_PERSONALITY_PROMPT` | Replaces her default personality prompt. |
| `RANDOM_MESSAGE_CHANCE` | Chance (0-100) that she replies to a message in a channel where she is not activated. Default `5`. Set `0` to turn it off. |
| `RANDOM_DM_ENABLED` | Set `false` to stop random DMs. |
| `RANDOM_DM_MIN_HOURS` | Minimum hours between two random DMs. Default `6`. |
| `RANDOM_DM_USER_COOLDOWN_HOURS` | Minimum hours before the same person gets another one. Default `72`. |

`.env` is in `.gitignore`, so your keys stay off GitHub.

### 4. Invite her to your server

In the Developer Portal, go to **OAuth2 > URL Generator**. Select the `bot` and `applications.commands` scopes. Select these permissions: View Channels, Send Messages, Read Message History, and Manage Messages. Open the URL and pick your server.

### 5. Run it

```bash
npm install
npm run dev          # uses AI_PROVIDER from .env
npm run dev:gemini   # always Gemini
npm run dev:ollama   # always Ollama
```

When she is ready, the console shows `Zero Two Discord Bot Online!` and the provider she is using. Slash commands can take a few minutes to show up in Discord.

## How the random DMs work

The bot keeps track of who sent a server message in the last 30 minutes. Every 15 minutes, it may DM one of those people, but only when all of these are true:

- At least `RANDOM_DM_MIN_HOURS` have passed since the last random DM. The count also starts over when the bot restarts.
- That person has not had one in the last `RANDOM_DM_USER_COOLDOWN_HOURS`.
- A 25% dice roll passes.

If the person has DMs closed, she skips them.

## Project layout

```
src/
  index.ts          Discord client, message handling, startup
  config.ts         Reads settings from .env
  personality.ts    Her personality prompt
  ai.ts             Builds prompts and asks the AI for replies
  commands.ts       Slash commands
  memory.ts         Per-channel conversation memory
  logger.ts         Conversation log files
  randomDM.ts       Random DMs to active users
  providers/        Gemini and Ollama back ends
```

## Troubleshooting

- **She says something went wrong, or the console shows 429:** the Gemini quota ran out. Wait for it to reset, or switch to Ollama.
- **She replies twice, once with an error:** two copies of the bot are running. Stop the extra one with Ctrl+C.
- **She does not respond at all:** check the token, check that Message Content Intent is on, and check that she can read and send messages in that channel.
- **Login fails with "disallowed intents":** turn on Message Content Intent in the Developer Portal.
- **Ollama errors:** make sure Ollama is running and that `OLLAMA_MODEL` matches a model you pulled (`ollama list`).

## License

MIT. Use it and change it however you like.
