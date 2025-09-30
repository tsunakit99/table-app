import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// biome-ignore lint/suspicious/noExplicitAny: CloudflareのD1型定義が不完全なため
export const db = drizzle(process.env.DB as any, { schema });
