import * as v from "valibot";

export const registerSchema = v.object({
  name: v.pipe(v.string(), v.minLength(3), v.maxLength(20)),
  email: v.pipe(
    v.string(),
    v.email("Invalid email"),
    v.minLength(3),
    v.maxLength(20)
  ),
  password: v.pipe(v.string(), v.minLength(8), v.maxLength(20)),
});
