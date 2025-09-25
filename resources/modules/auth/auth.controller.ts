import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  signup = async (request: Request, response: Response) => {
    const userCreated = await this.authService.signup(request);

    return response.status(201).json(userCreated);
  };

  confirmationAccount = async (request: Request, response: Response) => {
    await this.authService.confirmationAccount(request);

    return response.status(200).json({ message: "Account confirmed!" });
  };
}
