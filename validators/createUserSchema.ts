import { z } from "zod";

export const createUserSchema = z
  .object({
    userId: z.string(),
  })
  .or(
    z.object({
      members: z.array(z.string()).min(1),
      name: z.string().optional(),
    })
  );
