import * as v from "valibot";

export const createUserSchema = v.union([
  v.object({
    userId: v.string(),
  }),
  v.object({
    members: v.pipe(v.array(v.string()), v.minLength(1)),
    name: v.optional(v.string()),
  }),
]);
