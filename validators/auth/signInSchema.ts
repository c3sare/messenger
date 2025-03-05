import * as v from "valibot";

export const signInSchema = v.object({
  email: v.pipe(
    v.string(),
    v.email("Invalid email"),
    v.minLength(3),
    v.maxLength(20)
  ),
  password: v.pipe(v.string(), v.minLength(8), v.maxLength(20)),
});
