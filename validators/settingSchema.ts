import { z } from "zod";

export const settingSchema = z.object({
  name: z.string().min(3).max(30),
  image: z.string().url().optional().nullable(),
});
