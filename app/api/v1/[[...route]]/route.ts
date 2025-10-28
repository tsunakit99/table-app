import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { handle } from "hono/vercel";
import { ZodError } from "zod";
import { ERROR_CODES } from "@/errors/codes";
import { COMMON_ERROR_MESSAGES } from "@/errors/messages";
import { ApiError } from "@/types/error";
import authRoutes from "./routes/auth";
import drinksRoutes from "./routes/drinks";

const app = new Hono().basePath("/api/v1");

// Global Error Handler
app.onError((err, c) => {
  // Zod Validation Error
  if (err instanceof ZodError) {
    return c.json(
      {
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: COMMON_ERROR_MESSAGES.VALIDATION_ERROR,
          details: err.issues,
        },
      },
      400
    );
  }

  // Custom API Error
  if (err instanceof ApiError) {
    return new Response(
      JSON.stringify({
        error: {
          code: err.code,
          message: err.message,
          details: err.details,
        },
      }),
      {
        status: err.statusCode,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // Hono HTTP Exception
  if (err instanceof HTTPException) {
    return c.json(
      {
        error: {
          code: ERROR_CODES.HTTP_ERROR,
          message: err.message,
        },
      },
      err.status
    );
  }

  // Unknown Error
  return c.json(
    {
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      },
    },
    500
  );
});

// Register routes
app.route("/auth", authRoutes);
app.route("/drinks", drinksRoutes);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);

export type AppType = typeof app;
