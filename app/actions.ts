// app/actions.ts (or wherever signupWithEmail is located)
'use server';

import { z } from 'zod';
import { hash } from 'bcrypt';
import prisma from '@/app/utils/prisma'; // Assuming prisma client is here
import { signIn } from '@/app/utils/auth'; // Import server-side signIn
import { AuthError } from 'next-auth'; // Import specific error type
import { Resend } from 'resend'; // or use nodemailer
import { createVerificationToken } from './utils/tokens'; // Custom function to create a token
import { saveTokenToDb } from './utils/db'; // Save token with expiration and email



// Updated validation schema
const SignupSchema = z.object({
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

// Define return type
type SignupResult = {
    success: boolean;
    message: string;
    errors?: z.ZodIssue[];
};

export async function signupWithEmail(
    prevState: SignupResult | undefined,
    formData: FormData
): Promise<SignupResult> {
    // Validate form data using the updated schema
    const validatedFields = SignupSchema.safeParse({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
        passwordConfirmation: formData.get('passwordConfirmation'),
    });

    // Handle validation failure
    if (!validatedFields.success) {
        console.log('Validation Errors:', validatedFields.error.flatten().fieldErrors);
        return {
            success: false,
            message: 'Please correct the errors below.',
            errors: validatedFields.error.issues,
        };
    }

    // Destructure validated data (now includes name)
    const { firstName, lastName, email, password } = validatedFields.data;

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if (existingUser) {
            return { success: false, message: 'An account with this email already exists.' };
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create user in the database (include name)
        await prisma.user.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                // emailVerified: null, // Consider for email verification later
            },
        });

        console.log('User created successfully:', email);

        // Return success state
        return { success: true, message: 'Account created successfully! Please log in.' };

    } catch (error) {
        console.error('Signup Error:', error);
        return { success: false, message: 'An unexpected error occurred. Please try again.' };
    }
}

// Define return type for useFormState
type LoginResult = {
    success: boolean;
    message: string;
    // No need for errors array like in signup validation
};

export async function loginWithEmail(
    prevState: LoginResult | undefined,
    formData: FormData
): Promise<LoginResult> {
    const email = formData.get('email');
    const password = formData.get('password');

    // Basic validation: Ensure fields are present
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
        return { success: false, message: 'Please enter both email and password.' };
    }

    try {
        console.log(`Attempting login for: ${email}`);
        // Attempt sign in using credentials provider
        // Redirect is handled by NextAuth throwing NEXT_REDIRECT error internally if successful
        await signIn('credentials', {
            email,
            password,
            redirectTo: '/dashboard', // Or wherever you want users to land after login
        });

        // If signIn completes without throwing/redirecting (shouldn't happen on success with redirectTo)
        // This path indicates something unexpected occurred, but not necessarily an auth failure handled by authorize.
        console.warn(`signIn for ${email} completed without redirect or expected error.`);
        return { success: false, message: 'Login attempt processed but no redirect occurred.' };

    } catch (error) {
        console.error('Login Error:', error);

        // if (error instanceof AuthError) {
        //     if (error.cause?.err?.message) {
        //         return { success: false, message: `Login failed: ${error.cause.err.message}` };
        //     } else if (error.toString() === 'CredentialsSignin') {
        //         return { success: false, message: 'Invalid email or password.' };
        //     } else if (error.toString() === 'CallbackRouteError') {
        //         return { success: false, message: `Login failed: Callback error` }; // Fallback message
        //     } else {
        //         return { success: false, message: `Login failed: ${error.message}` };
        //     }
        // }

        // IMPORTANT: Re-throw errors that aren't authentication failures we want to handle gracefully
        // This includes NEXT_REDIRECT errors which MUST be re-thrown for redirects to work.
        throw error;
    }
}


const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(prevState: any, formData: FormData) {
    const email = formData.get('email')?.toString().trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, message: 'Please enter a valid email address.' };
    }

    const token = await createVerificationToken(email);
    await saveTokenToDb(email, token);

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

    try {
        await resend.emails.send({
            from: 'no-reply@yourdomain.com',
            to: email,
            subject: 'Verify your email',
            html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email address.</p>`,
        });

        return { success: true, message: 'Verification link sent. Check your inbox.' };
    } catch (err) {
        return { success: false, message: 'Failed to send email. Try again later.' };
    }
}