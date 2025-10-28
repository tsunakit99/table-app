import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { AUTH_ERROR_MESSAGES } from "@/features/routes/auth/errors";
import { hashPassword } from "@/lib/auth/password";
import { createDb } from "@/lib/database";
import { users } from "@/lib/database/schema";
import { ApiError } from "@/types/error";
import { signUpSchema } from "@/utils/validation/auth-schemas";

const app = new Hono();

// signUpSchemaからconfirmPasswordを除外（APIでは不要）
const apiSignUpSchema = signUpSchema.omit({ confirmPassword: true });

app.post("/signup", zValidator("json", apiSignUpSchema), async (c) => {
  const db = createDb();

  const { name, email, password } = c.req.valid("json");

  // メールアドレスの正規化
  const normalizedEmail = email.trim().toLowerCase();

  // 既存ユーザーチェック
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, normalizedEmail),
  });

  if (existingUser) {
    throw new ApiError(
      "EMAIL_ALREADY_EXISTS",
      AUTH_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
      409
    );
  }

  // パスワードのハッシュ化
  const passwordHash = await hashPassword(password);

  // ユーザー作成
  const now = new Date();
  await db.insert(users).values({
    id: crypto.randomUUID(),
    name,
    email: normalizedEmail,
    passwordHash,
    role: "member",
    createdAt: now,
    updatedAt: now,
  });

  return c.json({ message: "ユーザー登録が完了しました" }, 201);
});

export default app;
