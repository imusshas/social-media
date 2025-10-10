import { z } from "zod";

const REQUIRED_STRING = "Required";

export const SignupSchema = z.object({
  email: z.email("Invalid email").min(1, REQUIRED_STRING),
  username: z
    .string(REQUIRED_STRING)
    .min(3, "Must be at least three characters")
    .trim()
    .regex(
      /^[a-z0-9._-]+$/,
      "Only lowercase letters, numbers, - and _ allowed",
    ),
  password: z.string().min(8, "Must be at least eight characters"),
});

export type SignUpValues = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  username: z.string().min(1, REQUIRED_STRING),
  password: z.string().min(1, REQUIRED_STRING),
});

export type LoginValues = z.infer<typeof LoginSchema>;
