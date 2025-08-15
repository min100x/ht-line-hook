import app from './app';
import config, { validateConfig } from './config/config';

// Validate configuration
validateConfig();

app.listen(config.port, (): void => {
  console.log(`🚀 Server is running on port ${config.port}`);
  console.log(
    `📊 Health check available at http://localhost:${config.port}/health`
  );
  console.log(
    `🔗 API endpoints available at http://localhost:${config.port}/api`
  );
  console.log(`🌍 Environment: ${config.nodeEnv}`);
});
