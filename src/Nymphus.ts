import { Client } from 'discord.js';
import ready from './listeners/ready';
import interactionCreate from './listeners/interactionCreate';

const token = process.env.NYMPHUS_DISCORD_BOT_TOKEN;

console.log('Bot is starting...');

const client = new Client({
  intents: [],
});

ready(client);
interactionCreate(client);

client.login(token);
