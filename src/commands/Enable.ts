import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "./Command";
import { QueryError } from "mysql2";
import NotificationChannelService from "../services/NotificationChannelService";

export const Enable: Command = {
    name: "enable",
    description: "Enable water reminders in this channel.",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const guildId = interaction.guildId;
        const channelId = interaction.channelId;

        if (!channelId || !guildId) {
            console.error("Channel ID or Guild ID is undefined");
            return;
        }

        try {
            await NotificationChannelService.addNotificationChannel({ guildId, channelId });

            await interaction.followUp({ content: "This channel will now receive water reminders! 💧", ephemeral: true });
        } catch (error) {
            const duplicateError = isQueryError(error) && error.code === 'ER_DUP_ENTRY';
            const errorMessage = duplicateError ? "This channel is already subscribed to water reminders." : "There was an error subscribing this channel to water reminders. Please try again later.";
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    }
};

function isQueryError(error: any): error is QueryError {
    return error && error.code && typeof error.code === 'string';
}
