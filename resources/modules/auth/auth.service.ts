import { Request } from "express";
import { AuthRepository } from "./auth.repository";
import { createError } from "../../core/create-error";
import { hashPassword } from "../../core/password";
import { mailer } from "../../providers/mail/mailer";
import crypto from "crypto";
import { env } from "../../config/env";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}
  async signup(request: Request) {
    const { body } = request;

    //Verify if user already exists
    const userExists = await this.authRepository.findOne({ email: body.email });
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
    const expiresAt = new Date(Date.now() + env.emailTokenExpiration * 1000);
    await this.authRepository.createVerificationToken({
      token,
      userId: createdUser.id,
      expiresAt,
    });

    const confirmUrl = `${env.CONFIRMATION_URL}/${token}`;

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
    const user = await this.authRepository.findOne({
      id: verificationToken.userId,
    });
    if (!user) {
      throw createError("USER_NOT_FOUND");
    }

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
}
