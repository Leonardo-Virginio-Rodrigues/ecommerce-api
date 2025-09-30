export const ErrorCatalog = {
  // Unauthorized
  INVALID_TOKEN: {
    statusCode: 401,
    friendlyMessage: "Invalid token",
  },
  TOKEN_EXPIRED: {
    statusCode: 401,
    friendlyMessage: "Token has expired",
  },
  INVALID_CREDENTIAL: {
    statusCode: 401,
    friendlyMessage: "Credentials incorrect",
  },

  // Forbidden
  USER_NOT_ACTIVE: {
    statusCode: 403,
    friendlyMessage: "User is not active",
  },

  //Not Found
  USER_NOT_FOUND: {
    statusCode: 404,
    friendlyMessage: "User not found",
  },

  // Conflict
  USER_ALREADY_ACTIVE: {
    statusCode: 409,
    friendlyMessage: "User is already active",
  },
  EMAIL_ALREADY_EXISTS: {
    statusCode: 409,
    friendlyMessage: "Email already exists",
  },

  //To many requests
  TOO_MANY_EMAILS: {
    statusCode: 429,
    friendlyMessage: "Too many emails sent",
  },
} as const;

export type ErrorCatalogKey = keyof typeof ErrorCatalog;
