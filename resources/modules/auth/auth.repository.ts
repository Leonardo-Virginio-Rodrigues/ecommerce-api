import { PrismaClient } from "@prisma/client";
import { SignupDto } from "./auth.dto";

export class AuthRepository {
  constructor(private readonly prismaClient: PrismaClient) {}
  async findOne(filter: any) {
    return await this.prismaClient.user.findUnique({ where: filter });
  }

  async create(userToCreate: SignupDto) {
    return await this.prismaClient.user.create({ data: userToCreate });
  }

  async createVerificationToken(tokenToCreate: any) {
    return await this.prismaClient.emailVerificationToken.create({
      data: tokenToCreate,
    });
  }
}
