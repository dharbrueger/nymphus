import { Guild, User } from 'discord.js';

class MemberService {
  private guild: Guild;

  constructor(guild: Guild) {
    this.guild = guild;
  }

  async getUsers(): Promise<User[]> {
    try {
      const members = await this.guild.members.fetch();
      const users: User[] = members.map((member) => member.user);
      return users;
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw error;
    }
  }
}

class MemberServiceFactory {
  private static cache: Map<string, MemberService> = new Map();

  static getService(guild: Guild): MemberService {
    if (!this.cache.has(guild.id)) {
      const service = new MemberService(guild);
      this.cache.set(guild.id, service);
    }
    return this.cache.get(guild.id)!;
  }
}

export default MemberServiceFactory;
