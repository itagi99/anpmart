import { createClient, type Client } from '@libsql/client';

let client: Client | undefined;

function getClient(): Client | null {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL?.trim();
  if (!url) return null;

  client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN?.trim(),
  });
  return client;
}

function requireClient(): Client {
  const database = getClient();
  if (!database) {
    throw new Error('Database is unavailable. Configure TURSO_DATABASE_URL to enable database operations.');
  }
  return database;
}

const database = new Proxy({} as Client, {
  get(_target, property) {
    const database = requireClient();
    const value = database[property as keyof Client];
    return typeof value === 'function' ? value.bind(database) : value;
  },
});

export default database;

export async function dbQuery<T = any>(sql: string, args: any[] = []): Promise<T[]> {
  const database = getClient();
  if (!database) return [];

  const result = await database.execute({ sql, args });
  return result.rows as T[];
}

export async function dbExecute(sql: string, args: any[] = []) {
  const result = await requireClient().execute({ sql, args });
  return Number(result.rowsAffected);
}

export async function dbInsert(sql: string, args: any[] = []) {
  const result = await requireClient().execute({ sql, args });
  return Number(result.lastInsertRowid);
}
