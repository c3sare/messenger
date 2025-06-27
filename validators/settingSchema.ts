import { z } from "zod/v4-mini";

export const settingSchema = z.object({
  name: z.string().check(z.minLength(3), z.maxLength(30)),
  image: z.nullable(z.optional(z.url())),
});
