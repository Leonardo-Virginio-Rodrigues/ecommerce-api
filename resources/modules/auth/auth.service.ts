import { Request } from "express";
import { AuthRepository } from "./auth.repository";
import { createError } from "../../core/create-error";
import { hashPassword } from "../../core/password";
import { mailer } from "../../core/mailer";
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

    const confirmUrl = `${env.CONFIRMATION_URL}?token=${token}`;

    //send confirmation email
    mailer.sendMail({
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
}
