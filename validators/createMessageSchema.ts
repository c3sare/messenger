import { z } from "zod";

export const createMessageSchema = z.object({
  conversationId: z.number(),
  image: z.string().optional(),
  body: z.string().optional(),
});
