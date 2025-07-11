import { z } from "zod/mini";

export const createMessageSchema = z.object({
  conversationId: z.number(),
  image: z.optional(z.string()),
  body: z.optional(z.string()),
});
