// src/middlewares/authenticate.ts
import { NextFunction, Request, Response } from "express";
import { createError } from "../core/create-error";
import { AuthService } from "../modules/auth/auth.service";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization") || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw createError("INVALID_TOKEN");
  }

  try {
    const payload = AuthService.verifyAccessToken(token);
    req.auth = payload;

    return next();
  } catch {
    throw createError("INVALID_TOKEN");
  }
}
