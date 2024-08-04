import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "./Command";
import waterFacts from "../data/waterFacts";
import connection from "../services/DataManager";
import { QueryError } from "mysql2";

interface Reminder {
    userId: string;
}

const getSubscribers = (): Promise<Reminder[]> => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM reminders", (error: QueryError, results: Reminder[]) => {
            if (error) {
                console.error(error);
                reject(error);
                return;
            }

            resolve(results);
        });
    });
};

export const Remind: Command = {
    name: "remind",
    description: "Manually trigger a reminder to drink water",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const getRandomWaterFact = () => {
            return waterFacts[Math.floor(Math.random() * waterFacts.length)];
        };

        const generalTextChannel = "generalTextChannelId";

        const channel = await client.channels.fetch(generalTextChannel);

        await interaction.deleteReply();

        if (channel && channel.isTextBased()) {
            let message = `💧 Don't forget to drink water! 💧\n\nSubscribe to reminders by typing /remindme\n\nHere's a water fact: ${getRandomWaterFact()}`;
            const guild = client.guilds.cache.get("guildId");
            const subscriberList = await getSubscribers();

            const memberMessages = await Promise.all(subscriberList.map(async (subscriber) => {
                const user = await guild?.members.fetch(subscriber.userId);
                if (user) {
                    return user;
                }
                return "";
            }));

            const filteredMemberMessages = memberMessages.filter(Boolean).join(", ");
            const memberMessage = `\n\nCurrent subscribers: ${filteredMemberMessages}`;

            message += memberMessage;
            channel.send(message);
        }
    }
};