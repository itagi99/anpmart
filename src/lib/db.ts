import { createClient, type Client } from '@libsql/client';

let client: Client | undefined;

function getClient(): Client {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

  if (!url) {
    throw new Error(
      'TURSO_DATABASE_URL is not configured. Add the database URL to the project environment variables.',
    );
  }

  client = createClient({ url, authToken });
  return client;
}

const database = new Proxy({} as Client, {
  get(_target, property) {
    const value = getClient()[property as keyof Client];
    return typeof value === 'function' ? value.bind(getClient()) : value;
  },
});

export default database;

export async function dbQuery<T = any>(sql: string, args: any[] = []): Promise<T[]> {
  const result = await getClient().execute({ sql, args });
  return result.rows as T[];
}

export async function dbExecute(sql: string, args: any[] = []) {
  const result = await getClient().execute({ sql, args });
  return Number(result.rowsAffected);
}

export async function dbInsert(sql: string, args: any[] = []) {
  const result = await getClient().execute({ sql, args });
  return Number(result.lastInsertRowid);
}
