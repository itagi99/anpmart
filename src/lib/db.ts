import { createClient } from '@libsql/client';

const databaseUrl =
  process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || 'file:./anpmart.db';
const authToken = process.env.TURSO_AUTH_TOKEN || process.env.TURSO_DATABASE_TOKEN;

const client = createClient({
  url: databaseUrl,
  ...(authToken ? { authToken } : {}),
});

export default client;

export async function dbQuery<T = any>(sql: string, args: any[] = []): Promise<T[]> {
  const result = await client.execute({ sql, args });
  return result.rows as T[];
}

export async function dbExecute(sql: string, args: any[] = []) {
  const result = await client.execute({ sql, args });
  return Number(result.rowsAffected);
}

export async function dbInsert(sql: string, args: any[] = []) {
  const result = await client.execute({ sql, args });
  return Number(result.lastInsertRowid);
}
