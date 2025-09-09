"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecretFromKey = getSecretFromKey;
exports.getSecret = getSecret;
const fs_1 = __importDefault(require("fs"));
function getSecretFromKey(fileName, key) {
    try {
        const filePath = `/run/secrets/${fileName}`;
        const fileContent = fs_1.default.readFileSync(filePath, 'utf8').trim();
        const secrets = {};
        // Parse the file content into a key-value object
        fileContent.split('\n').forEach((line) => {
            const [lineKey, lineValue] = line.split('=');
            secrets[lineKey.trim()] = lineValue.trim();
        });
        // Check if the requested key exists and return its value
        if (key in secrets) {
            return secrets[key];
        }
        else {
            // Fallback for development if not using Docker secrets
            console.warn(`Secret "${key}" not found. Using environment variable fallback.`);
            return process.env[key];
        }
    }
    catch (err) {
        // If the file itself is not found or readable, log an error
        console.error(`Error reading secret file "${fileName}":`, err);
        console.warn(`Using environment variable fallback.`);
        return process.env[key];
    }
}
function getSecret(name) {
    try {
        return fs_1.default.readFileSync(`/run/secrets/${name}`, 'utf8').trim();
    }
    catch (err) {
        // Fallback for development if not using Docker secrets
        console.warn(`Secret "${name}" not found. Using environment variable fallback.`);
        return process.env[name];
    }
}
