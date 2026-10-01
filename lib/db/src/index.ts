import { drizzle } from "drizzle-orm/node-postgres";
import { eq, sql } from "drizzle-orm";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

let database: ReturnType<typeof drizzle> | undefined;

export function getDatabase() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be set to enable shared persistence');
  if (!database) database = drizzle(new Pool({ connectionString: process.env.DATABASE_URL }), { schema });
  return database;
}

export * from "./schema";

export async function readSiteStoreValue(key: string) {
  const db = getDatabase();
  const [row] = await db.select({ value: schema.siteStoreTable.value }).from(schema.siteStoreTable).where(eq(schema.siteStoreTable.key, key)).limit(1);
  return row?.value ?? null;
}

export async function writeSiteStoreValue(key: string, value: unknown) {
  const db = getDatabase();
  const updatedAt = new Date();
  await db.insert(schema.siteStoreTable).values({ key, value, updatedAt }).onConflictDoUpdate({ target: schema.siteStoreTable.key, set: { value, updatedAt } });
}

export async function appendSiteStoreValue(key: string, value: unknown) {
  const db = getDatabase();
  const updatedAt = new Date();
  await db.insert(schema.siteStoreTable).values({ key, value: [value], updatedAt }).onConflictDoUpdate({
    target: schema.siteStoreTable.key,
    set: { value: sql`${schema.siteStoreTable.value} || ${JSON.stringify(value)}::jsonb`, updatedAt },
  });
}
