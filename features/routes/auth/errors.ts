import { ERROR_CODES } from "@/errors/codes";
import { COMMON_ERROR_MESSAGES } from "@/errors/messages";

// UI-side messages for locally controlled error states (e.g., catch blocks, NextAuth mappings)
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "メールアドレスまたはパスワードが正しくありません",
  EMAIL_ALREADY_EXISTS: "このメールアドレスは既に登録されています",
  SIGNUP_FAILED: "登録に失敗しました。もう一度お試しください",
  UNKNOWN_ERROR: "ログインに失敗しました。しばらく経ってから再度お試しください",
  NETWORK: COMMON_ERROR_MESSAGES.NETWORK,
} as const;

// Maps server-sent error codes to UI messages so API responses stay decoupled from presentation text
export const AUTH_ERROR_CODE_MESSAGES = {
  EMAIL_ALREADY_EXISTS: AUTH_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
  [ERROR_CODES.VALIDATION_ERROR]: COMMON_ERROR_MESSAGES.VALIDATION_ERROR,
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
  [ERROR_CODES.HTTP_ERROR]: COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
} as const;

export const NEXTAUTH_ERROR_CODES = {
  CredentialsSignin: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
} as const;

export type AuthErrorMessageKey = keyof typeof AUTH_ERROR_MESSAGES;
export type AuthErrorCode = keyof typeof AUTH_ERROR_CODE_MESSAGES;
