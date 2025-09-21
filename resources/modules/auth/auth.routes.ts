import { Router } from "express";
import { validateRequest } from "../../middlewares/validate-request";
import { signupDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AuthRepository } from "./auth.repository";
import { PrismaClient } from "@prisma/client";

const authRouter = Router();

const prismaClient = new PrismaClient();
const authRepository = new AuthRepository(prismaClient);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

authRouter.post("/signup", validateRequest(signupDto), authController.signup);

export default authRouter;
