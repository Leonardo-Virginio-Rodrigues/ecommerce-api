import { PrismaClient } from "@prisma/client";
import { SignupDto } from "./auth.dto";

export class AuthRepository {
  constructor(private readonly prismaClient: PrismaClient) {}
  async findOne(filter: any) {
    return await this.prismaClient.user.findUnique({ where: filter });
  }

  async findVerificationToken(filter: any) {
    return await this.prismaClient.emailVerificationToken.findUnique({
      where: filter,
    });
  }

  async updateUser(userId: string, data: any) {
    return await this.prismaClient.user.update({
      where: { id: userId },
      data,
    });
  }

  async create(userToCreate: SignupDto) {
    return await this.prismaClient.user.create({ data: userToCreate });
  }

  async deleteVerificationToken(tokenId: string) {
    return await this.prismaClient.emailVerificationToken.delete({
      where: { id: tokenId },
    });
  }

  async createVerificationToken(tokenToCreate: any) {
    return await this.prismaClient.emailVerificationToken.create({
      data: tokenToCreate,
    });
  }
}
