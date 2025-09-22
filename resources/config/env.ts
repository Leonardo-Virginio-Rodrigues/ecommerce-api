import "dotenv/config";

export const env = {
  port: Number(process.env.PORT || 3333),

  jwtSecret: process.env.JWT_SECRET || "dev",

  smtp: {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT || 587),
    user: process.env.MAIL_USE,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM || "no-reply@example.com",
    secure: process.env.MAIL_SECURE === "true",
  },

  emailTokenExpiration: Number(process.env.EMAIL_TOKEN_EXPIRATION || 3600),
  CONFIRMATION_URL:
    process.env.CONFIRMATION_URL || "http://localhost:3000/auth/confirmation",
};
