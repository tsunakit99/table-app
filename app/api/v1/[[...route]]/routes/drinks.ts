import { Hono } from "hono";
import { createDb } from "@/lib/database";
import { drinks } from "@/lib/database/schema";

const app = new Hono();

app.get("/", async (c) => {
  const db = createDb();
  const result = await db.select().from(drinks);
  return c.json({ drinks: result });
});

export default app;
