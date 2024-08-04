import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "./Command";
import connection from "../services/DataManager";

export const RemindMe: Command = {
    name: "remindme",
    description: "Subscribe to a reminder to drink water",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const userId = interaction.user.id;
        const query = `INSERT INTO reminders (userId) VALUES ('${userId}')`;

        connection.query(query, (error, results) => {
            if (error) {
                console.error(error);
                return;
            }

            const content = "You have successfully subscribed to the reminder!";
            interaction.followUp({
                ephemeral: true,
                content
            });
        });
    }
};