import fs from 'fs';

export function getSecretFromKey(fileName: string, key: string) {
    try {
        const filePath = `/run/secrets/${fileName}`;
        const fileContent = fs.readFileSync(filePath, 'utf8').trim();
        const secrets: { [key: string]: string } = {};

        // Parse the file content into a key-value object
        fileContent.split('\n').forEach((line) => {
            const [lineKey, lineValue] = line.split('=');
            secrets[lineKey.trim()] = lineValue.trim();
        });

        // Check if the requested key exists and return its value
        if (key in secrets) {
            return secrets[key];
        } else {
            // Fallback for development if not using Docker secrets
            console.warn(`Secret "${key}" not found. Using environment variable fallback.`);
            return process.env[key]!;
        }
    } catch (err) {
        // If the file itself is not found or readable, log an error
        console.error(`Error reading secret file "${fileName}":`, err);
        console.warn(`Using environment variable fallback.`);
        return process.env[key]!;
    }
}

export function getSecret(name: string) {
    try {
        return fs.readFileSync(`/run/secrets/${name}`, 'utf8').trim();
    } catch (err) {
        // Fallback for development if not using Docker secrets
        console.warn(`Secret "${name}" not found. Using environment variable fallback.`);
        return process.env[name];
    }
}
