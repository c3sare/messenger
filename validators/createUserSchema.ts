import { z } from "zod";

export const createUserSchema = z
  .object({
    userId: z.string(),
  })
  .or(
    z.object({
      isGroup: z.literal(true),
      members: z.array(z.object({ value: z.string() })),
      name: z.string().optional(),
    })
  );
