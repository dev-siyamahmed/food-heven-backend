import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ invalid_type_error: 'Name must be a String' })
      .min(1, { message: 'Name is required' }),
    email: z
      .string({ invalid_type_error: 'Email must be a Requird' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string({ invalid_type_error: 'Password must be a Requird' })
      .min(6, { message: 'Password must be at least 6 characters long' }),
  }),
});

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ invalid_type_error: 'Email must be a string' })
      .email({ message: 'Invalid email address' }),

    password: z
      .string({ invalid_type_error: 'Password must be a string' })
      .min(6, { message: 'Wrong Password' }),
  }),
});

export const AuthValidation = {
  loginUserValidationSchema,
  createUserValidationSchema,
};
