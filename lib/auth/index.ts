import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createDb } from "../database";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "../database/schema";
import { verifyPassword } from "./password";

export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
  const db = createDb();
  return {
    adapter: DrizzleAdapter(db, {
      usersTable: users,
      accountsTable: accounts,
      sessionsTable: sessions,
      verificationTokensTable: verificationTokens,
    }),
    providers: [
      Credentials({
        name: "メールアドレスとパスワード",
        credentials: {
          email: { label: "メールアドレス", type: "email" },
          password: { label: "パスワード", type: "password" },
        },
        async authorize(credentials) {
          const rawEmail = credentials?.email;
          const rawPassword = credentials?.password;
          if (typeof rawEmail !== "string" || typeof rawPassword !== "string") {
            return null;
          }
          const email = rawEmail.trim().toLowerCase();
          const password = rawPassword;
          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });
          if (!user) {
            return null;
          }
          const isValid = await verifyPassword(password, user.passwordHash);
          if (!isValid) {
            return null;
          }
          return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            role: user.role,
          };
        },
      }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.role =
            "role" in user && typeof user.role === "string"
              ? user.role
              : "member";
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.role =
            typeof token.role === "string" &&
            (token.role === "admin" || token.role === "member")
              ? token.role
              : "member";
        }
        return session;
      },
      async signIn() {
        return true;
      },
    },
    pages: { signIn: "/auth/signin" },
  };
});
