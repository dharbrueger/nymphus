import connection from './ConnectionManagerService';
import { QueryError } from 'mysql2';

export interface Reminder {
  userId: string;
  guildId: string;
}

interface ReminderFilter {
  userId?: string;
  guildId?: string;
}

class ReminderService {
  static getReminders(filter: ReminderFilter = {}): Promise<Reminder[]> {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM reminders';
      const queryParams: string[] = [];

      if (filter.userId) {
        queryParams.push(`userId = '${filter.userId}'`);
      }
      if (filter.guildId) {
        queryParams.push(`guildId = '${filter.guildId}'`);
      }

      if (queryParams.length > 0) {
        query += ' WHERE ' + queryParams.join(' AND ');
      }

      connection.query(query, (error: QueryError, results: Reminder[]) => {
        if (error) {
          console.error(error);
          reject(error);
          return;
        }

        resolve(results);
      });
    });
  }

  static addReminder(reminder: Reminder): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO reminders (userId, guildId) VALUES ('${reminder.userId}', '${reminder.guildId}')`;

      connection.query(query, (error: QueryError) => {
        if (error) {
          if (error.code !== 'ER_DUP_ENTRY') {
            console.error(error);
          }
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  static deleteReminder(reminder: Reminder): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM reminders WHERE userId = '${reminder.userId}' AND guildId = '${reminder.guildId}'`;

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

export default ReminderService;
