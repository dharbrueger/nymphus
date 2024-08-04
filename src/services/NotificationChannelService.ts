import connection from './ConnectionManagerService';
import { QueryError } from 'mysql2';

export interface NotificationChannel {
    guildId: string;
    channelId: string;
}

class NotificationChannelService {
    static getNotificationChannels(): Promise<NotificationChannel[]> {
        return new Promise((resolve, reject) => {
            let query = "SELECT * FROM notificationchannels";

            connection.query(query, (error: QueryError, results: NotificationChannel[]) => {
                if (error) {
                    console.error(error);
                    reject(error);
                    return;
                }

                resolve(results);
            });
        });
    }

    static addNotificationChannel(notificationChannel: NotificationChannel): Promise<void> {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO notificationchannels (guildId, channelId) VALUES ('${notificationChannel.guildId}', '${notificationChannel.channelId}')`;

            connection.query(query, (error: QueryError) => {
                if (error) {
                    if (error.code !== "ER_DUP_ENTRY") {
                        console.error(error);
                    }
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    }

    static deleteNotificationChannel(notificationChannel: NotificationChannel): Promise<void> {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM notificationChannel WHERE guildId = '${notificationChannel.guildId}' AND channelId = '${notificationChannel.guildId}'`;

            connection.query(query, (error: QueryError) => {
                if (error) {
                    console.error(error);
                    reject(error);
                    return;
                }

                resolve();
            });
        });
    }
}

export default NotificationChannelService;
