import * as z from 'zod';

export const USERNAME_MIN_LENGTH = 2;
export const USERNAME_MAX_LENGTH = 15;
export const PASSWORD_MIN_LENGTH = 6;

// Login form schema
export const loginFormSchema = z.object({
  username: z
    .string()
    .min(USERNAME_MIN_LENGTH, {
      message: `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
    })
    .max(USERNAME_MAX_LENGTH, {
      message: `Username cannot be more than ${USERNAME_MAX_LENGTH} characters`,
    })
    .transform((val) => val.toLowerCase()),
  password: z.string().min(PASSWORD_MIN_LENGTH, {
    message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

// Register form schema
export const registerFormSchema = z
  .object({
    username: z
      .string()
      .min(USERNAME_MIN_LENGTH, {
        message: `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
      })
      .max(USERNAME_MAX_LENGTH, {
        message: `Username cannot be more than ${USERNAME_MAX_LENGTH} characters`,
      })
      .transform((val) => val.toLowerCase()),
    password: z.string().min(PASSWORD_MIN_LENGTH, {
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    }),
    confirmPassword: z.string().min(PASSWORD_MIN_LENGTH, {
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
