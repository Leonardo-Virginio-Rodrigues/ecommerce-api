import "dotenv/config";

export const ONE_MONTH_IN_SECONDS = 60 * 60 * 24 * 31;
export const ONE_WEEK_IN_SECONDS = 60 * 60 * 24 * 7;
export const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
export const ONE_HOUR_IN_SECONDS = 60 * 60;
export const FIFTEEN_MINUTES_IN_SECONDS = 60 * 15;

export const env = {
  port: Number(process.env.PORT || 3333),

  security: {
    jwtSecret: process.env.JWT_SECRET || "dev",
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET || "refresh",
    jwtAccessExpiration:
      Number(process.env.JWT_ACCESS_EXPIRATION) || FIFTEEN_MINUTES_IN_SECONDS,
    jwtRefreshExpiration:
      Number(process.env.JWT_REFRESH_EXPIRATION) || ONE_DAY_IN_SECONDS,
    rememberMeExpiration:
      Number(process.env.REMEMBER_ME_EXPIRATION) || ONE_WEEK_IN_SECONDS,
  },
  email: {
    emailTokenExpiration: Number(process.env.EMAIL_TOKEN_EXPIRATION || 3600),
    confirmationUrl:
      process.env.CONFIRMATION_URL || "http://localhost:3000/auth/confirmation",
    smtp: {
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT || 587),
      user: process.env.MAIL_USE,
      pass: process.env.MAIL_PASS,
      from: process.env.MAIL_FROM || "no-reply@example.com",
      secure: process.env.MAIL_SECURE === "true",
    },
    emailResendCooldownMs: Number(process.env.EMAIL_RESEND_COOLDOWN_MS),
  },
};
