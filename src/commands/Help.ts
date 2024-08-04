import { CommandInteraction, Client, ApplicationCommandType } from 'discord.js';
import { Command } from './Command';

export const Help: Command = {
  name: 'help',
  description: 'Discover more about the bot and its commands',
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const helpMessage = `Hello! I'm a bot that helps you stay hydrated by reminding you to drink water. Here are some commands you can use:
    - /enable: Enable water reminders for the current channel
    - /subscribe: Subscribe to water reminders
    - /unsubscribe: Unsubscribe from water reminders
    - /remind: Manually trigger a reminder to drink water

    Note: commands are only available in text channels. If you have any questions or feedback, feel free to reach out to my creator, @osorubeki.
    `;

    interaction.reply({ content: helpMessage, ephemeral: true });
  },
};
