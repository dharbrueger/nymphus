import { Guild, Channel } from "discord.js";
import WaterFactsService from "./WaterFactsService";
import ReminderService, { Reminder } from "./ReminderService";

export class MessagesService {
    private waterFactsService = new WaterFactsService();
    private defaultReminderMessage = `💧 Don't forget to drink water! 💧\n\nSubscribe to reminders by typing /remindme\n\nHere's a water fact: ${this.waterFactsService.getRandomFact()}`;

    public sendDefaultWaterReminderToChannel(channel: Channel): void {
        const message = this.defaultReminderMessage;
        this.sendMessageToTextChannel(channel, message);
    }

    public async sendSubscriberWaterReminderToChannel(channel: Channel, guild: Guild | undefined, subscriberList: Reminder[]): Promise<void> {
        if (!guild) {
            console.error("Guild is undefined");
            return;
        }

        const message = await this.appendSubscriberMessages(guild, this.defaultReminderMessage);
        this.sendMessageToTextChannel(channel, message);
    }

    private sendMessageToTextChannel(channel: Channel, message: string): void {
        if (channel && channel.isTextBased()) {
            channel.send(message);
        }

        console.log("Channel is either not a text channel or does not exist");
        return;
    }

    private async appendSubscriberMessages(guild: Guild, message: string): Promise<string> {
        const subscriberList = await ReminderService.getReminders({ guildId: guild.id });

        const memberMessages = await Promise.all(subscriberList.map(async (subscriber) => {
            try {
                const user = await guild.members.fetch(subscriber.userId);
                if (user && user.guild.id === subscriber.guildId) {
                    return `${user.user}`;
                }
                return "";
            } catch (error) {
                console.error("Error fetching user:", subscriber.userId);
                return "";
            }
        }));

        const filteredMemberMessages = memberMessages.filter(Boolean).join(", ");
        const memberMessage = filteredMemberMessages.length > 0 ? `\n\nCurrent subscribers: ${filteredMemberMessages}` : "";

        return message + memberMessage;
    }
}

export default MessagesService;
