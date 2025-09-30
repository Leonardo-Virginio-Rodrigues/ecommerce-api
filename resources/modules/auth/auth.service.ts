import { Request } from "express";
import { AuthRepository } from "./auth.repository";
import { createError } from "../../core/create-error";
import { hashPassword, verifyPassword } from "../../core/password";
import { mailer } from "../../providers/mail/mailer";
import crypto, { randomBytes } from "crypto";
import { env } from "../../config/env";
import jwt, { SignOptions } from "jsonwebtoken";
import { RefreshDto, SigninDto } from "./auth.dto";
import { SessionToken, User } from "@prisma/client";
import { JwtPayload } from "../../common/types/auth";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}
  async signup(request: Request) {
    const { body } = request;

    //Verify if user already exists
    const userExists = await this.authRepository.findOneUser({
      email: body.email,
    });
    if (userExists) {
      throw createError("EMAIL_ALREADY_EXISTS");
    }

    //Encrypeted password
    body.password = await hashPassword(body.password);

    //Set user status to PENDING
    body.status = "PENDING";

    //Create user
    const createdUser = await this.authRepository.create(body);

    //Create verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(
      Date.now() + env.email.emailTokenExpiration * 1000
    );
    await this.authRepository.createVerificationToken({
      token,
      userId: createdUser.id,
      expiresAt,
    });

    const confirmUrl = `${env.email.confirmationUrl}/${token}`;

    //send confirmation email
    await mailer.sendMail({
      from: process.env.MAIL_FROM,
      to: body.email,
      subject: "Confirme sua conta",
      template: "confirm-account",
      context: {
        name: body.name,
        url: confirmUrl,
        year: new Date().getFullYear(),
      },
    } as any);

    return { message: "User created successfully" };
  }

  async signin(signinDto: SigninDto) {
    //Find user by email
    const userFromDb = await this.authRepository.findOneUserOrThrow({
      email: signinDto.email,
    });

    //Check if user is active
    if (userFromDb.status !== "ACTIVE") {
      throw createError("USER_NOT_ACTIVE");
    }

    //Verify user password
    const passwordIsValid = await verifyPassword(
      signinDto.password,
      userFromDb.password
    );

    if (!passwordIsValid) {
      throw createError("INVALID_CREDENTIAL");
    }

    //Generate Tokens and return
    const { accessToken, refreshToken } = await this.generateAndSaveUserTokens(
      userFromDb,
      signinDto
    );

    return { accessToken, refreshToken };
  }

  async refresh(refreshDto: RefreshDto) {
    // Verify if refreshToken exists
    const sessionFromDb = await this.authRepository.findOneSession({
      deviceId: refreshDto.deviceId,
      refreshToken: refreshDto.refreshToken,
    });

    if (!sessionFromDb) {
      throw createError("INVALID_TOKEN");
    }

    //Check if token is expired
    if (sessionFromDb.expiresAt < new Date()) {
      await this.authRepository.deleteSessions({
        userId: sessionFromDb.userId,
        deviceId: refreshDto.deviceId,
      });
      throw createError("TOKEN_EXPIRED");
    }

    // Verify if user exists
    const userFromDb = await this.authRepository.findOneUserOrThrow({
      id: sessionFromDb.userId,
    });

    // Create new Tokens and Update
    const payload: JwtPayload = {
      email: userFromDb.email,
      name: userFromDb.name,
      role: userFromDb.role,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken();

    await this.authRepository.updateSession({
      deviceId: refreshDto.deviceId,
      refreshToken: refreshDto.refreshToken,
      newRefreshToken: refreshToken,
    });

    return { accessToken, refreshToken };
  }

  async confirmationAccount(request: Request) {
    const { token } = request.params;

    //Find verification token
    const verificationToken = await this.authRepository.findVerificationToken({
      token,
    });
    if (!verificationToken) {
      throw createError("INVALID_TOKEN");
    }

    //Check if token is expired
    if (verificationToken.expiresAt < new Date()) {
      throw createError("TOKEN_EXPIRED");
    }

    //Find user
    const user = await this.authRepository.findOneUserOrThrow({
      id: verificationToken.userId,
    });

    //Update user status to ACTIVE
    if (user.status === "ACTIVE") {
      throw createError("USER_ALREADY_ACTIVE");
    }

    user.status = "ACTIVE";
    await this.authRepository.updateUser(user.id, { status: user.status });

    //Delete verification token
    await this.authRepository.deleteVerificationToken(verificationToken.id);

    return { message: "Account confirmed successfully" };
  }

  //Functios for manage tokens (generate, validate, revoke) can be added here

  async generateAndSaveUserTokens(user: User, signinDto: SigninDto) {
    //Delete user token with equal device ID
    await this.authRepository.deleteSessions({
      userId: user.id,
      deviceId: signinDto.deviceId,
    });

    const refreshTokenTTL: number = signinDto.rememberMe
      ? env.security.rememberMeExpiration
      : env.security.jwtRefreshExpiration;
    const expiresAt = new Date(Date.now() + refreshTokenTTL * 1000);

    const payload: JwtPayload = {
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken();

    await this.authRepository.createSession({
      deviceId: signinDto.deviceId,
      refreshToken,
      userId: user.id,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  generateAccessToken(payload: JwtPayload) {
    const jwtSecret = env.security.jwtSecret;
    const options: SignOptions = {
      expiresIn: env.security.jwtAccessExpiration,
    };

    return jwt.sign(payload, jwtSecret, options);
  }

  generateRefreshToken() {
    return randomBytes(32).toString("base64url");
  }
}
