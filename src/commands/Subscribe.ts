import { CommandInteraction, Client, ApplicationCommandType } from 'discord.js';
import { Command } from './Command';
import ReminderService from '../services/ReminderService';
import { QueryError } from 'mysql2';

export const Subscribe: Command = {
  name: 'subscribe',
  description: 'Subscribe to a reminder to drink water',
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    if (!userId || !guildId) {
      console.error('User ID or Guild ID is undefined');
      return;
    }

    try {
      await ReminderService.addReminder({ userId, guildId });

      await interaction.followUp({
        content: 'You are now subscribed to water reminders! 💧',
        ephemeral: true,
      });
    } catch (error) {
      const duplicateError =
        isQueryError(error) && error.code === 'ER_DUP_ENTRY';
      const errorMessage = duplicateError
        ? 'You are already subscribed to water reminders.'
        : 'There was an error subscribing you to water reminders. Please try again later.';
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  },
};

function isQueryError(error: any): error is QueryError {
  return error && error.code && typeof error.code === 'string';
}
