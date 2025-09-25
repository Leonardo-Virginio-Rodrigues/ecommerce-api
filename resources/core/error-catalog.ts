export const ErrorCatalog = {
  USER_NOT_FOUND: {
    statusCode: 404,
    friendlyMessage: "User not found",
  },
  EMAIL_ALREADY_EXISTS: {
    statusCode: 409,
    friendlyMessage: "Email already exists",
  },

  INVALID_TOKEN: {
    statusCode: 401,
    friendlyMessage: "Invalid token",
  },

  TOKEN_EXPIRED: {
    statusCode: 401,
    friendlyMessage: "Token has expired",
  },

  USER_ALREADY_ACTIVE: {
    statusCode: 409,
    friendlyMessage: "User is already active",
  },
} as const;

export type ErrorCatalogKey = keyof typeof ErrorCatalog;
