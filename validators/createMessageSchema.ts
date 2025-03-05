import * as v from "valibot";

export const createMessageSchema = v.object({
  conversationId: v.number(),
  image: v.optional(v.string()),
  body: v.optional(v.string()),
});
