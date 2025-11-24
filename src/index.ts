import { 
  Client, 
  GatewayIntentBits, 
  Events, 
  ActivityType,
  PresenceUpdateStatus,
  REST,
  Routes,
  Message,
  ChannelType
} from 'discord.js';
import { config } from './config.js';
import { initializeGemini, generateResponse } from './gemini.js';
import { memory } from './memory.js';
import { 
  commands,
  handlePing,
  handleActivate,
  handleDeactivate,
  handleReset,
  handleDarlingsThoughts
} from './commands.js';
import { logConversation } from './logger.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  presence: {
    status: PresenceUpdateStatus.DoNotDisturb,
    activities: [{
      name: '𝓣𝓱𝓲𝓷𝓴𝓲𝓷𝓰 𝓪𝓫𝓸𝓾𝓽 𝓶𝔂 𝓭𝓪𝓻𝓵𝓲𝓷𝓰',
      type: ActivityType.Custom,
      state: '𝓣𝓱𝓲𝓷𝓴𝓲𝓷𝓰 𝓪𝓫𝓸𝓾𝓽 𝓶𝔂 𝓭𝓪𝓻𝓵𝓲𝓷𝓰'
    }]
  }
});

async function registerCommands() {
  if (!config.discordToken) {
    throw new Error('Discord token not configured');
  }

  const rest = new REST({ version: '10' }).setToken(config.discordToken);

  try {
    console.log('🔄 Registering slash commands...');
    
    await rest.put(
      Routes.applicationCommands(client.user!.id),
      { body: commands }
    );

    console.log('✅ Slash commands registered successfully!');
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
}

async function handleMessage(message: Message) {
  if (message.author.bot) return;

  const channelId = message.channelId;
  const isDM = message.channel.type === ChannelType.DM;
  const isMentioned = message.mentions.has(client.user!.id);
  const isActivated = memory.isActivated(channelId);

  const shouldRespond = isDM || isMentioned || isActivated;

  if (!shouldRespond) return;

  if (isActivated && !isMentioned) {
    const random = Math.random() * 100;
    if (random > config.randomMessageChance && Math.random() > 0.3) {
      memory.addMessage(channelId, 'user', message.content);
      return;
    }
  }

  try {
    if ('sendTyping' in message.channel) {
      await message.channel.sendTyping();
    }

    let userMessage = message.content;
    if (isMentioned) {
      userMessage = userMessage.replace(/<@!?\d+>/g, '').trim();
    }

    memory.addMessage(channelId, 'user', userMessage);
    
    const history = memory.getHistory(channelId, 50);

    const response = await generateResponse(userMessage, history);

    memory.addMessage(channelId, 'assistant', response);

    if (response.length > 2000) {
      const chunks = response.match(/[\s\S]{1,2000}/g) || [];
      for (const chunk of chunks) {
        await message.reply(chunk);
      }
    } else {
      await message.reply(response);
    }

    await logConversation(message.author.tag, userMessage, response);
  } catch (error) {
    console.error('Error handling message:', error);
    await message.reply('*looks confused* Sorry darling, something went wrong in my head... Can you say that again? 💕');
  }
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌸 Zero Two Discord Bot Online! 🌸');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Logged in as: ${readyClient.user.tag}`);
  console.log(`✅ Bot ID: ${readyClient.user.id}`);
  console.log(`✅ Serving ${readyClient.guilds.cache.size} server(s)`);
  console.log(`✅ Model: ${config.geminiModel}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await registerCommands();

  readyClient.user.setPresence({
    status: PresenceUpdateStatus.DoNotDisturb,
    activities: [{
      name: '𝓣𝓱𝓲𝓷𝓴𝓲𝓷𝓰 𝓪𝓫𝓸𝓾𝓽 𝓶𝔂 𝓭𝓪𝓻𝓵𝓲𝓷𝓰',
      type: ActivityType.Custom,
      state: '𝓣𝓱𝓲𝓷𝓴𝓲𝓷𝓰 𝓪𝓫𝓸𝓾𝓽 𝓶𝔂 𝓭𝓪𝓻𝓵𝓲𝓷𝓰'
    }]
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    switch (interaction.commandName) {
      case 'ping':
        await handlePing(interaction);
        break;
      case 'activate':
        await handleActivate(interaction);
        break;
      case 'deactivate':
        await handleDeactivate(interaction);
        break;
      case 'reset':
        await handleReset(interaction);
        break;
      case 'darlings-thoughts':
        await handleDarlingsThoughts(interaction);
        break;
    }
  } catch (error) {
    console.error('Error handling command:', error);
    
    const reply = {
      content: '*looks apologetic* Sorry darling, something went wrong! Try again? 💕',
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

client.on(Events.MessageCreate, handleMessage);

client.on(Events.Error, (error) => {
  console.error('Discord client error:', error);
});

async function start() {
  try {
    if (!config.discordToken) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ DISCORD_BOT_TOKEN is missing!');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('Please add your Discord bot token to:');
      console.error('1. The Secrets tab (recommended), or');
      console.error('2. Create a .env file with DISCORD_BOT_TOKEN=your_token');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      process.exit(1);
    }

    if (!config.googleApiKey) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ GOOGLE_API_KEY is missing!');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('Please add your Google AI API key to:');
      console.error('1. The Secrets tab (recommended), or');
      console.error('2. Create a .env file with GOOGLE_API_KEY=your_key');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      process.exit(1);
    }

    initializeGemini();

    await client.login(config.discordToken);
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

start();
