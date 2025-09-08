// File: ecosystem.config.js
module.exports = {
    apps: [{
      name: "rabbitmq-log-puller",
      script: "dist/main.js", // Change this to your application's entry point
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: "production",
      },
    }]
  }; 