import { Client } from 'discord.js';
import { Commands } from '../commands/Commands';
import ReminderService from '../services/ReminderService';
import MessagesService from '../services/MessagesService';
import NotificationChannelService from '../services/NotificationChannelService';

const currentHour = new Date().getHours();
const shouldRemind = currentHour >= 8 && currentHour < 20;

export default (client: Client): void => {
  client.on('ready', async () => {
    if (!client.user || !client.application) {
      return;
    }

    // need to move all of this to a service
    const channelsToRemind =
      await NotificationChannelService.getNotificationChannels();
    const guildChannelsMap = new Map<string, any[]>();

    channelsToRemind.forEach((channel) => {
      if (!guildChannelsMap.has(channel.guildId)) {
        guildChannelsMap.set(channel.guildId, []);
      }
      guildChannelsMap.get(channel.guildId)?.push(channel.channelId);
    });

    await client.application.commands.set(Commands);

    console.log(`${client.user.username} is online`);

    const sendReminderToChannel = async (
      channelId: string,
      guildId: string
    ) => {
      const channel = await client.channels.fetch(channelId);
      console.log(
        `Sending reminder to channel: ${channelId} in guild: ${guildId}`
      );
      console.log(`Should remind: ${shouldRemind}`);
      if (shouldRemind && channel && channel.isTextBased()) {
        const messagesService = new MessagesService();
        const messages = await channel.messages.fetch({ limit: 1 });
        const lastMessage = messages.first();

        if (lastMessage && lastMessage.author.id !== client.user?.id) {
          const guild = client.guilds.cache.get(guildId);
          if (guild) {
            await messagesService.sendSubscriberWaterReminderToChannel(
              channel,
              guild,
              await ReminderService.getReminders({ guildId: guild.id })
            );
          }
        }
      }
    };

    const now = new Date();
    const nextHour = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours() + 1,
      0,
      0,
      0
    );
    const timeUntilNextHour = nextHour.getTime() - now.getTime();

    console.log(`Next reminder scheduled at: ${nextHour.toLocaleTimeString()}`);

    const sendReminders = async () => {
      // Iterate over the guildChannelsMap to send reminders
      for (const [guildId, channels] of guildChannelsMap.entries()) {
        console.log(
          `Sending reminders to channels in guild: ${guildId} with channels: ${channels}`
        );
        await Promise.all(
          channels.map((channel) => sendReminderToChannel(channel, guildId))
        );
      }
      const nextReminderTime = new Date();
      nextReminderTime.setHours(nextReminderTime.getHours() + 1);
      console.log(
        `Next reminder scheduled at: ${nextReminderTime.toLocaleTimeString()}`
      );
    };

    setTimeout(() => {
      sendReminders();
      setInterval(sendReminders, 3600000); // 1 hour
    }, timeUntilNextHour);
  });
};
