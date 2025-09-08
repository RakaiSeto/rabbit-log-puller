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
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDbConnection = exports.getDbConnection = void 0;
const pg_1 = require("pg");
const secret_1 = require("../utils/secret");
// Initialize the PostgreSQL connection pool
const getDbConnection = (database) => {
    return new pg_1.Pool({
        user: (0, secret_1.getSecret)('DB_USER'),
        host: (0, secret_1.getSecret)('DB_HOST'),
        database: database,
        password: (0, secret_1.getSecret)('DB_PASSWORD'),
        port: parseInt((0, secret_1.getSecret)('DB_PORT')),
    });
};
exports.getDbConnection = getDbConnection;
const testDbConnection = (database) => __awaiter(void 0, void 0, void 0, function* () {
    let client;
    try {
        client = yield (0, exports.getDbConnection)(database).connect();
        // Run a simple, non-destructive query to check the connection
        yield client.query('SELECT 1');
        console.log('✅ Database connection successful!');
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
    }
    finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }
});
exports.testDbConnection = testDbConnection;
