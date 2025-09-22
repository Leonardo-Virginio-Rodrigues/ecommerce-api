import { AppError } from "./app-error";
import { ErrorCatalog, ErrorCatalogKey } from "./error-catalog";

export function createError(key: ErrorCatalogKey) {
  const { statusCode, friendlyMessage } = ErrorCatalog[key];
  return new AppError(key, statusCode, friendlyMessage);
}
