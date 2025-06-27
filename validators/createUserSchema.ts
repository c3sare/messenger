import { z } from "zod/v4-mini";

export const createUserSchema = z.union([
  z.object({
    userId: z.string(),
  }),
  z.object({
    members: z.array(z.string().check(z.minLength(1))),
    name: z.optional(z.string()),
  }),
]);
