import z, { email } from "zod";

export const signupDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
});

export const signinDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
  deviceId: z.string(),
});

export const refreshDto = z.object({
  refreshToken: z.string(),
  deviceId: z.string(),
});

export type SigninDto = z.infer<typeof signinDto>;
export type SignupDto = z.infer<typeof signupDto>;
export type RefreshDto = z.infer<typeof refreshDto>;
