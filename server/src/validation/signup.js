const { z } = require("zod");

const signupSchema = z.object({
  username: z.string().min(5, "Username must have at least 5 characters"),
  password: z
    .string()
    .min(8, "Password must have at least 8 characters")
    .regex(/[A-Z]/, "Password must have at least one uppercase letter")
    .regex(/[a-z]/, "Password must have at least one lowercase letter")
    .regex(/[0-9]/, "Password must have at least one digit")
    .regex(/[\W_]/, "Password must have at least one special character"),
});

module.exports = { signupSchema };