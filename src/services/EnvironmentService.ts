import * as dotenv from "dotenv";

dotenv.config();

class EnvironmentService {
    private static instance: EnvironmentService;
    public readonly NYMPHUS_DISCORD_BOT_TOKEN: string;
    public readonly DB_HOST: string;
    public readonly DB_NAME: string;
    public readonly DB_USERNAME: string;
    public readonly DB_PASSWORD: string;
    public readonly CHANNEL_IDS: string;
    public readonly GUILD_IDS: string;

    private constructor() {
        this.NYMPHUS_DISCORD_BOT_TOKEN = this.getEnvVariable("NYMPHUS_DISCORD_BOT_TOKEN");
        this.DB_HOST = this.getEnvVariable("DB_HOST");
        this.DB_NAME = this.getEnvVariable("DB_NAME");
        this.DB_USERNAME = this.getEnvVariable("DB_USERNAME");
        this.DB_PASSWORD = this.getEnvVariable("DB_PASSWORD");
        this.CHANNEL_IDS = this.getEnvVariable("CHANNEL_IDS");
        this.GUILD_IDS = this.getEnvVariable("GUILD_IDS");
    }

    public static getInstance(): EnvironmentService {
        if (!EnvironmentService.instance) {
            EnvironmentService.instance = new EnvironmentService();
        }
        return EnvironmentService.instance;
    }

    private getEnvVariable(key: string): string {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Environment variable ${key} is not defined`);
        }
        return value;
    }
}

export const environmentService = EnvironmentService.getInstance();
