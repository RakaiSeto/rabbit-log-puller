import { Pool } from 'pg';
import { getSecret } from '../utils/secret';
// Initialize the PostgreSQL connection pool
export const getDbConnection = (database: string): Pool => {
    return new Pool({
        user: getSecret('DB_USER'),
        host: getSecret('DB_HOST'),
        database: database,
        password: getSecret('DB_PASSWORD'),
        port: parseInt(getSecret('DB_PORT')!),
    });
};

export const testDbConnection = async (database: string) => {
    let client;
    try {
        client = await getDbConnection(database).connect();
        // Run a simple, non-destructive query to check the connection
        await client.query('SELECT 1');
        console.log('✅ Database connection successful!');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
    } finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }
};
