import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email").min(3).max(20),
  password: z.string().min(8).max(20),
});
