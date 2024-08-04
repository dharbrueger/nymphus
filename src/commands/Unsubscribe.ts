import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "./Command";
import ReminderService from "../services/ReminderService";

export const Unsubscribe: Command = {
    name: "unsubscribe",
    description: "Unsubscribe from all reminders.",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const userId = interaction.user.id;
        const guildId = interaction.guildId;

        if (!userId || !guildId) {
            console.error("User ID or Guild ID is undefined");
            return;
        }

        try {
            const reminders = await ReminderService.getReminders({ userId, guildId });
            if (reminders.length === 0) {
                await interaction.followUp({ content: "You are not subscribed to any reminders.", ephemeral: true });
                return;
            }

            await ReminderService.deleteReminder({ userId, guildId });

            await interaction.followUp({ content: "You have been removed from the reminder list.", ephemeral: true });
        } catch (error) {
            // const duplicateError = isQueryError(error) && error.code === 'ER_DUP_ENTRY';
            const errorMessage = "There was an error removing you from water reminders. Please try again later.";
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    }
};
