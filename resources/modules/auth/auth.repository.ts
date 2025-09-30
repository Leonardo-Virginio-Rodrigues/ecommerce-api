import { PrismaClient } from "@prisma/client";
import { SignupDto } from "./auth.dto";
import { createError } from "../../core/create-error";

export class AuthRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  // Model User
  async findOneUser(filter: any) {
    return await this.prismaClient.user.findUnique({ where: filter });
  }

  async findOneUserOrThrow(filter: any) {
    const userFromDb = await this.prismaClient.user.findUnique({
      where: filter,
    });
    if (!userFromDb) {
      throw createError("USER_NOT_FOUND");
    }
    return userFromDb;
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

  //Model emailVerificationToken

  async findVerificationToken(filter: any) {
    return await this.prismaClient.emailVerificationToken.findUnique({
      where: filter,
    });
  }

  //Create Token or Update existing token
  async upsertVerificationToken(filter: any, data: any) {
    return this.prismaClient.emailVerificationToken.upsert({
      where: filter,
      update: {
        token: data.token,
        expiresAt: data.expiresAt,
        createdAt: new Date(),
      },
      create: {
        userId: filter.userId!, // se usar userId como unique
        token: data.token,
        expiresAt: data.expiresAt,
      },
    });
  }

  async deleteVerificationToken(filter: any) {
    return await this.prismaClient.emailVerificationToken.delete({
      where: filter,
    });
  }

  async createVerificationToken(tokenToCreate: any) {
    return await this.prismaClient.emailVerificationToken.create({
      data: tokenToCreate,
    });
  }

  // Model user Sessions
  async createSession({
    deviceId,
    refreshToken,
    userId,
    expiresAt,
  }: {
    deviceId: string;
    refreshToken: string;
    userId: string;
    expiresAt: Date;
  }) {
    return await this.prismaClient.sessionToken.create({
      data: { refreshToken, userId, expiresAt, deviceId },
    });
  }

  async findOneSession(filter: any) {
    return await this.prismaClient.sessionToken.findUnique({
      where: filter,
    });
  }

  async updateSession({
    deviceId,
    refreshToken,
    newRefreshToken,
  }: {
    deviceId: string;
    refreshToken: string;
    newRefreshToken: string;
  }) {
    await this.prismaClient.sessionToken.update({
      where: { deviceId, refreshToken },
      data: { refreshToken: newRefreshToken },
    });
  }

  async deleteSessions({
    userId,
    deviceId,
  }: {
    userId: string;
    deviceId: string;
  }) {
    const filter = { userId, deviceId };
    return await this.prismaClient.sessionToken.deleteMany({
      where: filter,
    });
  }
}
