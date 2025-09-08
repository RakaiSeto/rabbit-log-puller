import { consumerDuitrapi } from './consumer/duitrapi/consumer';
import dotenv from 'dotenv';
import { getSecret } from './utils/secret';
dotenv.config();

async function startApp() {
  console.log('Application starting');

  try {
    // Start all consumers concurrently.
    // Each `start` function will set up its listener and run indefinitely.
    const consumerPromises = [
      consumerDuitrapi.start(),
    ];

    await Promise.all(consumerPromises);

  } catch (error) {
    console.error('Failed to start one or more consumers:', error);
    process.exit(1); // Exit if setup fails
  }

  console.log('All consumers have started and are listening for messages.');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  // Add logic here to close RabbitMQ and Database connections
  process.exit(0);
});

startApp();