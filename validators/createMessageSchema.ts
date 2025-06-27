import { z } from "zod/v4-mini";

export const createMessageSchema = z.object({
  conversationId: z.number(),
  image: z.optional(z.string()),
  body: z.optional(z.string()),
});
