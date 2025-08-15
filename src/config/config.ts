import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface Config {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  lineMessagingApi: {
    channelAccessToken: string;
  };
  openai: {
    apiKey: string;
  };
}

export const config: Config = {
  port: parseInt(process.env['PORT'] || '3000', 10),
  nodeEnv: process.env['NODE_ENV'] || 'development',
  corsOrigin: process.env['CORS_ORIGIN'] || '*',
  lineMessagingApi: {
    channelAccessToken: process.env['MESSAGING_API_CHANNEL_ACCESS_TOKEN'] || '',
  },
  openai: {
    apiKey: process.env['OPENAI_API_KEY'] || '',
  },
};

// Validate required environment variables
export function validateConfig(): void {
  const requiredVars = ['MESSAGING_API_CHANNEL_ACCESS_TOKEN'];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn(
      `⚠️  Warning: Missing required environment variables: ${missingVars.join(
        ', '
      )}`
    );
    console.warn(
      '   Some features may not work properly without these variables.'
    );
  }
}

export default config;
