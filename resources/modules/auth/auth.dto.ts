import z from "zod";

export const signupDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
});

export type SignupDto = z.infer<typeof signupDto>;
