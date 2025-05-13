import { z } from 'zod';

export const SignupSchema = z.object({
    // Add name validation (e.g., minimum 2 characters)
    firstName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    lastName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' }),
    passwordConfirmation: z.string(),
})
    // Refine step to check password match
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "Passwords don't match",
        path: ["passwordConfirmation"], // Attach error to the confirmation field
    });