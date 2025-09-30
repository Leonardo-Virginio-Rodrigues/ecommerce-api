import { Role } from "@prisma/client";

export type JwtPayload = {
  email: string;
  name: string;
  role: Role;
};

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}
