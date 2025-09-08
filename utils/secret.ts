import fs from 'fs';

export function getSecret(name: string) {
  try {
    return fs.readFileSync(`/run/secrets/${name}`, 'utf8').trim();
  } catch (err) {
    // Fallback for development if not using Docker secrets
    console.warn(`Secret "${name}" not found. Using environment variable fallback.`);
    return process.env[name];
  }
}

