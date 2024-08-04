import { Client, PresenceStatus } from "discord.js";
import { Commands } from "../commands/Commands";
import waterFacts from "../data/waterFacts";
import connection from "../services/DataManager";
import { QueryError } from "mysql2";

let nextSendTime = new Date(Date.now() + 3600000);

const currentHour = new Date().getHours();
const shouldRemind = currentHour >= 8 && currentHour < 20;

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

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }

        const generalTextChannel = "generalTextChannelId";
        const getRandomWaterFact = () => {
            return waterFacts[Math.floor(Math.random() * waterFacts.length)];
        };

        await client.application.commands.set(Commands);

        console.log(`${client.user.username} is online`);

        setInterval(async () => {
            const channel = await client.channels.fetch(generalTextChannel);

            if (shouldRemind && channel && channel.isTextBased()) {
                const messages = await channel.messages.fetch({ limit: 1 });
                const lastMessage = messages.first();

                if (lastMessage && lastMessage.author.id !== client.user?.id) {
                    let message = `💧 Don't forget to drink water! 💧\n\nSubscribe to reminders by typing /remindme\n\nHere's a water fact: ${getRandomWaterFact()}`;
                    const guild = client.guilds.cache.get("guildId");
                    const subscriberList = await getSubscribers();
                    console.log(subscriberList);

                    const memberMessages = await Promise.all(subscriberList.map(async (subscriber) => {
                        const user = await guild?.members.fetch(subscriber.userId);
                        if (user) {
                            return `@${user.user.username}`;
                        }
                        return "";
                    }));

                    const filteredMemberMessages = memberMessages.filter(Boolean).join(", ");
                    const memberMessage = `\n\nCurrent subscribers: ${filteredMemberMessages}`;

                    message += memberMessage;
                    channel.send(message);
                    nextSendTime = new Date(Date.now() + 3600000); // 1 hour
                }
            }
        }, 3600000); // 1 hour
    });
};//