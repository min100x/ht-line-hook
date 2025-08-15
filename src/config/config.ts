interface ServerConfig {
  port: number;
  host: string;
}

interface CorsConfig {
  origin: string;
  credentials: boolean;
}

interface AppConfig {
  server: ServerConfig;
  environment: string;
  cors: CorsConfig;
}

const config: AppConfig = {
  server: {
    port: parseInt(process.env["PORT"] || "3000", 10),
    host: process.env["HOST"] || "localhost",
  },
  environment: process.env["NODE_ENV"] || "development",
  cors: {
    origin: process.env["CORS_ORIGIN"] || "*",
    credentials: true,
  },
  // Add more configuration sections as needed
  // database: {
  //   url: process.env.DATABASE_URL
  // },
  // auth: {
  //   jwtSecret: process.env.JWT_SECRET
  // }
};

export default config;
