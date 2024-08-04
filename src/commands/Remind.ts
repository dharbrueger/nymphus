import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "./Command";
import ReminderService from "../services/ReminderService";
import MessagesService from "../services/MessagesService";

export const Remind: Command = {
    name: "remind",
    description: "Manually trigger a reminder to drink water",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const channelId = interaction.channelId;

        const sendReminderToChannel = async (channelId: string) => {
            const channel = await client.channels.fetch(channelId);
            if (channel && channel.isTextBased()) {
                const messagesService = new MessagesService();

                const guild = client.guilds.cache.find(guild => guild === interaction.guild);
                await messagesService.sendSubscriberWaterReminderToChannel(channel, guild, await ReminderService.getReminders({ guildId: guild?.id }));
            }
        };

        await interaction.deleteReply();

        await sendReminderToChannel(channelId);
    }
};
