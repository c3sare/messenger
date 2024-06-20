import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email("Invalid email").min(3).max(20),
  password: z.string().min(8).max(20),
});
