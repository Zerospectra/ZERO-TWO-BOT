import { Client } from 'discord.js';
import { config } from './config.js';
import { memory } from './memory.js';
import { generateProactiveDM } from './ai.js';
import { logConversation } from './logger.js';

interface Activity {
  lastActiveAt: number;
  guildName: string;
}

const HOUR_MS = 60 * 60 * 1000;
// How often the bot checks for someone to DM
const CHECK_INTERVAL_MS = 15 * 60 * 1000;
// A user counts as active if they sent a server message in this window
const ACTIVE_WINDOW_MS = 30 * 60 * 1000;
// Chance to send at a check, so the DMs do not come on a fixed schedule
const SEND_CHANCE = 0.25;

const recentActivity = new Map<string, Activity>();
const lastDMAtByUser = new Map<string, number>();
let lastDMAt = Date.now();

export function recordActivity(userId: string, guildName: string): void {
  recentActivity.set(userId, { lastActiveAt: Date.now(), guildName });
}

function pickActiveUser(now: number): [string, Activity] | undefined {
  const candidates: Array<[string, Activity]> = [];

  for (const [userId, activity] of recentActivity) {
    if (now - activity.lastActiveAt > ACTIVE_WINDOW_MS) {
      recentActivity.delete(userId);
      continue;
    }

    const lastUserDM = lastDMAtByUser.get(userId) ?? 0;
    if (now - lastUserDM >= config.randomDMUserCooldownHours * HOUR_MS) {
      candidates.push([userId, activity]);
    }
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

async function sendRandomDM(client: Client): Promise<void> {
  const now = Date.now();
  if (now - lastDMAt < config.randomDMMinHours * HOUR_MS) return;

  const picked = pickActiveUser(now);
  if (!picked || Math.random() >= SEND_CHANCE) return;

  const [userId, activity] = picked;
  // Start both cooldowns before sending, so a failed DM is not tried again at once
  lastDMAt = now;
  lastDMAtByUser.set(userId, now);

  try {
    const user = await client.users.fetch(userId);
    const dmChannel = await user.createDM();
    const channelId = dmChannel.id;
    const hasPriorHistory = memory.hasHistory(channelId);
    const history = memory.getHistory(channelId, 50);

    const dmMessage = await generateProactiveDM(history, hasPriorHistory, activity.guildName);

    await user.send(dmMessage);
    memory.addMessage(channelId, 'assistant', dmMessage);
    await logConversation(user.tag, '(random DM)', dmMessage);

    console.log(`💌 Zero Two sent a random DM to ${user.tag}`);
  } catch (error) {
    console.error('Error sending random DM:', error);
  }
}

export function startRandomDMs(client: Client): void {
  if (!config.randomDMEnabled) return;

  // Wait a full gap after startup, so a restart does not cause an extra DM
  lastDMAt = Date.now();
  setInterval(() => {
    sendRandomDM(client);
  }, CHECK_INTERVAL_MS);
}
