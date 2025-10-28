import { signIn } from "next-auth/react";
import type { ApiErrorResponse } from "@/types/error";
import {
  AUTH_ERROR_CODE_MESSAGES,
  AUTH_ERROR_MESSAGES,
  type AuthErrorCode,
} from "./errors";

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

type SignUpResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      error: string;
    };

export async function postSignUp(
  payload: SignUpPayload
): Promise<SignUpResult> {
  try {
    const response = await fetch("/api/v1/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { ok: true };
    }

    let message: string = AUTH_ERROR_MESSAGES.SIGNUP_FAILED;

    try {
      const data = (await response.json()) as Partial<ApiErrorResponse> | null;
      const apiError = data?.error;

      if (apiError && typeof apiError === "object") {
        const code = apiError.code;

        if (typeof code === "string") {
          const mapped = AUTH_ERROR_CODE_MESSAGES[code as AuthErrorCode];
          if (mapped) {
            message = mapped;
          }
        }
      }
    } catch {
      message = AUTH_ERROR_MESSAGES.SIGNUP_FAILED;
    }

    return { ok: false, error: message };
  } catch {
    return { ok: false, error: AUTH_ERROR_MESSAGES.NETWORK };
  }
}

type SignInPayload = {
  email: string;
  password: string;
  callbackUrl?: string;
};

type SignInResult =
  | {
      ok: true;
      redirectUrl: string;
    }
  | {
      ok: false;
      error: string;
    };

export async function postSignIn(
  payload: SignInPayload
): Promise<SignInResult> {
  try {
    const result = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
      callbackUrl: payload.callbackUrl ?? "/",
    });

    if (result?.error) {
      return {
        ok: false,
        error: AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
      };
    }

    return {
      ok: true,
      redirectUrl: result?.url ?? payload.callbackUrl ?? "/",
    };
  } catch {
    return {
      ok: false,
      error: AUTH_ERROR_MESSAGES.NETWORK,
    };
  }
}
