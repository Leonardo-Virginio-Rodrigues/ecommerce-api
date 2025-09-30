import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  signup = async (request: Request, response: Response) => {
    const userCreated = await this.authService.signup(request);

    return response.status(201).json(userCreated);
  };

  signin = async (request: Request, response: Response) => {
    const userTokens = await this.authService.signin(request.body);

    return response.status(200).json(userTokens);
  };

  refresh = async (request: Request, response: Response) => {
    const newTokens = await this.authService.refresh(request.body);

    return response.status(200).json(newTokens);
  };

  resendConfirmation = async (request: Request, response: Response) => {
    const resendResponse = await this.authService.resendConfirmation(
      request.body
    );

    return response.status(200).json(resendResponse);
  };

  confirmationAccount = async (request: Request, response: Response) => {
    await this.authService.confirmationAccount(request);

    return response.status(200).json({ message: "Account confirmed!" });
  };
}
