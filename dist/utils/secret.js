"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecret = getSecret;
const fs_1 = __importDefault(require("fs"));
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
