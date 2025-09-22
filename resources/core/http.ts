import { Request, Response, NextFunction } from "express";
import { AppError } from "./app-error";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.errorKey,
      message: err.friendlyMessage,
    });
  }

  console.error("Unexpected error:", err);
  return res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
}
