import { z } from "zod/v4-mini";

export const signInSchema = z.object({
  email: z.email().check(z.minLength(3), z.maxLength(20)),
  password: z.string().check(z.minLength(8), z.maxLength(20)),
});
