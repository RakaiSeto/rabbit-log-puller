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
const consumer_1 = require("./consumer/duitrapi/consumer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function startApp() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Application starting');
        try {
            // Start all consumers concurrently.
            // Each `start` function will set up its listener and run indefinitely.
            const consumerPromises = [
                consumer_1.consumerDuitrapi.start(),
            ];
            yield Promise.all(consumerPromises);
        }
        catch (error) {
            console.error('Failed to start one or more consumers:', error);
            process.exit(1); // Exit if setup fails
        }
        console.log('All consumers have started and are listening for messages.');
    });
}
// Handle graceful shutdown
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('SIGINT received. Shutting down gracefully...');
    // Add logic here to close RabbitMQ and Database connections
    process.exit(0);
}));
startApp();
