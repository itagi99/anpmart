import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://anpmart-turso07.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

export default client;

export async function dbQuery<T = any>(sql: string, args: any[] = []): Promise<T[]> {
  const result = await client.execute({ sql, args });
  return result.rows as T[];
}

export async function dbExecute(sql: string, args: any[] = []): Promise<number> {
  const result = await client.execute({ sql, args });
  return Number(result.rowsAffected);
}

export async function dbInsert(sql: string, args: any[] = []): Promise<number> {
  const result = await client.execute({ sql, args });
  return Number(result.lastInsertRowid);
}