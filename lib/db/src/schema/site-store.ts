import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const siteStoreTable = pgTable('nexhse_site_store', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
