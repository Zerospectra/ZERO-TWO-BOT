import { 
  SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  PermissionFlagsBits 
} from 'discord.js';
import { memory } from './memory.js';
import { generateProactiveDM, generateRandomThought } from './gemini.js';

export const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check Zero Two\'s response time'),
  
  new SlashCommandBuilder()
    .setName('activate')
    .setDescription('Allow Zero Two to chat freely in this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  
  new SlashCommandBuilder()
    .setName('deactivate')
    .setDescription('Stop Zero Two from chatting in this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  
  new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Clear Zero Two\'s memory of this conversation'),
  
  new SlashCommandBuilder()
    .setName('darlings-thoughts')
    .setDescription('Zero Two shares her current thoughts based on your conversation'),

    new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Have Zero Two send someone a private message')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user Zero Two should DM')
        .setRequired(true)),
].map(command => command.toJSON());

export async function handlePing(interaction: ChatInputCommandInteraction) {
  const ping = interaction.client.ws.ping;
  await interaction.reply({
    content: `*perks up excitedly* Darling! My connection to you is **${ping}ms**! *smiles* Pretty fast, right? I'll always be here when you need me~ 💕`,
    ephemeral: false
  });
}

export async function handleActivate(interaction: ChatInputCommandInteraction) {
  if (!interaction.guildId) {
    await interaction.reply({
      content: '*tilts head* Darling, `/activate` only works in a server channel. In DMs, just talk to me and I reply automatically. 💕',
      ephemeral: true
    });
    return;
  }

  const channelId = interaction.channelId;
  
  if (memory.isActivated(channelId)) {
    await interaction.reply({
      content: '*giggles* Darling, I\'m already active in this channel! You don\'t need to ask me twice~ 💕',
      ephemeral: true
    });
    return;
  }

  memory.setActivated(channelId, true);
  await interaction.reply({
    content: '*eyes light up with excitement* Really?! I can talk freely here now? *bounces happily* This is going to be so much fun, darling! 💕',
    ephemeral: false
  });
}

export async function handleDeactivate(interaction: ChatInputCommandInteraction) {
  if (!interaction.guildId) {
    await interaction.reply({
      content: '*giggles softly* Darling, `/deactivate` is only for server channels. In DMs, I only reply when you message me anyway. 💕',
      ephemeral: true
    });
    return;
  }

  const channelId = interaction.channelId;
  
  if (!memory.isActivated(channelId)) {
    await interaction.reply({
      content: '*pouts slightly* I wasn\'t active in this channel anyway, darling...',
      ephemeral: true
    });
    return;
  }

  memory.setActivated(channelId, false);
  await interaction.reply({
    content: '*looks a bit sad* Oh... you want me to be quiet here? *sighs* Okay, darling. I\'ll only respond when you directly talk to me. *turns away slightly*',
    ephemeral: false
  });
}

export async function handleReset(interaction: ChatInputCommandInteraction) {
  const channelId = interaction.channelId;
  
  if (!memory.hasHistory(channelId)) {
    await interaction.reply({
      content: '*tilts head* Darling, we haven\'t really talked much here yet. There\'s nothing to forget! *smiles*',
      ephemeral: true
    });
    return;
  }

  memory.clearHistory(channelId);
  await interaction.reply({
    content: '*blinks in confusion* Huh? What were we talking about? *shakes head* It\'s all fuzzy now... Let\'s start fresh, darling! 💕',
    ephemeral: false
  });
}

export async function handleDarlingsThoughts(interaction: ChatInputCommandInteraction) {
  const channelId = interaction.channelId;
  
  await interaction.deferReply();

  try {
    const history = memory.getHistory(channelId, 50);
    
    if (history.length === 0) {
      await interaction.editReply({
        content: '*looks thoughtful* We haven\'t talked much yet, darling. Chat with me first, and then I\'ll share what\'s on my mind! 💕'
      });
      return;
    }

    const thought = await generateRandomThought(history);
    await interaction.editReply({
      content: thought
    });
  } catch (error) {
    console.error('Error generating thought:', error);
    await interaction.editReply({
      content: '*shakes head* Sorry darling, my thoughts are a bit scrambled right now. Try again in a moment! 💕'
    });
  }
}

export async function handleDM(interaction: ChatInputCommandInteraction) {
  const targetUser = interaction.options.getUser('user', true);

  if (targetUser.bot) {
    await interaction.reply({
      content: '*shakes head* I can\'t talk to robots, darling. Pick a real person for me. 💕',
      ephemeral: true
    });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const dmChannel = await targetUser.createDM();
    const channelId = dmChannel.id;
    const hasPriorHistory = memory.hasHistory(channelId);
    const history = memory.getHistory(channelId, 50);

    const dmMessage = await generateProactiveDM(history, hasPriorHistory);

    await targetUser.send(dmMessage);
    memory.addMessage(channelId, 'assistant', dmMessage);

    await interaction.editReply({
      content: `Sent a DM to ${targetUser}!`
    });
  } catch (error) {
    console.error('Error sending proactive DM:', error);

    const errorMessage = '*looks frustrated* I couldn\'t DM that user, darling. Their DMs may be closed, they may have blocked me. :( ';

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        content: errorMessage
      });
    } else {
      await interaction.reply({
        content: errorMessage,
        ephemeral: true
      });
    }
  }
}