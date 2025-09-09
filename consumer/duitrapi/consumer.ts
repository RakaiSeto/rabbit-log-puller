import amqp from 'amqplib';
import { getDbConnection } from '../../lib/db'; // Hypothetical DB connection function
import { Pool } from 'pg';
import { getSecretFromKey } from '../../utils/secret';

const QUEUE_NAME = "DUITRAPI_ACT_LOG";
const DB_NAME = "duitrapi";
const TABLE_NAME = "activity_log";

let channel: amqp.Channel | null = null;

async function processMessage(msg: amqp.ConsumeMessage | null): Promise<void> {
  if (msg === null) {
    return;
  }

  try {
    const content = JSON.parse(msg.content.toString());

    // 1. Validate and transform data
    // ... business logic here ...

    // 2. Insert into database
    const db: Pool = getDbConnection(DB_NAME);
    const result = await db.query(`INSERT INTO ${TABLE_NAME} (activity_log_id, user_id, category, activity_name, is_success, timestamp, description) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [content.activity_log_id, content.user_id, content.category, content.activity_name, content.is_success, content.timestamp, content.description]);

    console.log(`[Consumer Duitrapi] Message processed: ${content.activity_log_id}`);

    // 3. Acknowledge the message
    channel?.ack(msg);

  } catch (error) {
    console.error('Failed to process message:', error);
    // 4. Reject the message (and optionally requeue or send to DLX)
    channel?.nack(msg, false, true); // false, false -> don't requeue
  }
}

export const consumerDuitrapi = {
  start: async (): Promise<void> => {
    const connection = await amqp.connect(getSecretFromKey('db', 'RABBITMQ_URL')!);
    channel = await connection.createChannel();
    const queueName = QUEUE_NAME;

    await channel.assertQueue(queueName, { durable: true });
    channel.prefetch(1); // Process one message at a time

    console.log(`[Consumer Duitrapi] Waiting for messages in ${queueName}.`);

    channel.consume(queueName, (msg) => processMessage(msg), { noAck: false });
  }
};
