export const ErrorCatalog = {
  USER_NOT_FOUND: {
    statusCode: 404,
    friendlyMessage: "Usuário não encontrado",
  },
  EMAIL_ALREADY_EXISTS: {
    statusCode: 409,
    friendlyMessage: "Email já está em uso",
  },
} as const;

export type ErrorCatalogKey = keyof typeof ErrorCatalog;
