// utils/with-error-handler.ts
import { NextResponse } from "next/server";
import { AppError } from "./errors";

type ApiHandler = (
  request: Request,
  ...args: any[]
) => Promise<Response> | Response;

export function withErrorHandler(handler: ApiHandler) {
  return async (request: Request, ...args: any[]) => {
    try {
      // Execute the actual endpoint code
      return await handler(request, ...args);
    } catch (error: any) {
      // 1. Log the error internally for debugging
      // console.error("❌ API Error Intercepted:", {
      //   message: error.message,
      //   stack: error.stack,
      //   url: request.url,
      // });

      // 2. Handle known operational errors (e.g., bad inputs, missing records)
      if (error instanceof AppError) {
        return NextResponse.json(error, { status: error.statusCode });
      }

      // 3. Fallback for unhandled programming crashes (e.g., DB down, syntax bugs)
      // We hide raw system details from the client to prevent security leaks
      return NextResponse.json(
        {
          success: false,
          error: "An unexpected internal server error occurred.",
        },
        { status: 500 },
      );
    }
  };
}
