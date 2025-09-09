"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumerDuitrapi = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const db_1 = require("../../lib/db"); // Hypothetical DB connection function
const secret_1 = require("../../utils/secret");
const QUEUE_NAME = "DUITRAPI_ACT_LOG";
const DB_NAME = "duitrapi";
const TABLE_NAME = "activity_log";
let channel = null;
function processMessage(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        if (msg === null) {
            return;
        }
        try {
            const content = JSON.parse(msg.content.toString());
            // 1. Validate and transform data
            // ... business logic here ...
            // 2. Insert into database
            const db = (0, db_1.getDbConnection)(DB_NAME);
            const result = yield db.query(`INSERT INTO ${TABLE_NAME} (activity_log_id, user_id, category, activity_name, is_success, timestamp, description) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [content.activity_log_id, content.user_id, content.category, content.activity_name, content.is_success, content.timestamp, content.description]);
            console.log(`[Consumer Duitrapi] Message processed: ${content.activity_log_id}`);
            // 3. Acknowledge the message
            channel === null || channel === void 0 ? void 0 : channel.ack(msg);
        }
        catch (error) {
            console.error('Failed to process message:', error);
            // 4. Reject the message (and optionally requeue or send to DLX)
            channel === null || channel === void 0 ? void 0 : channel.nack(msg, false, true); // false, false -> don't requeue
        }
    });
}
exports.consumerDuitrapi = {
    start: () => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield amqplib_1.default.connect((0, secret_1.getSecretFromKey)('db', 'RABBITMQ_URL'));
        channel = yield connection.createChannel();
        const queueName = QUEUE_NAME;
        yield channel.assertQueue(queueName, { durable: true });
        channel.prefetch(1); // Process one message at a time
        console.log(`[Consumer Duitrapi] Waiting for messages in ${queueName}.`);
        channel.consume(queueName, (msg) => processMessage(msg), { noAck: false });
    })
};
