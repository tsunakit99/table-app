// lib/database/index.ts
import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export type DbClient = DrizzleD1Database<typeof schema>;

/**
 * Cloudflare D1 + Drizzle クライアントを初期化するヘルパー
 * Hono のハンドラなど、どこからでも呼べる
 */
export const createDb = (): DbClient => {
  const ctx = getCloudflareContext(); // Non-async (sync access OK)
  const db = drizzle((ctx as any).env.DB as D1Database, { schema });
  return db as DbClient;
};
