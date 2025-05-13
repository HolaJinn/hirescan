'use server';

import { SignupSchema } from "@/app/utils/schema/signupSchema";
import { z } from 'zod'
import { hash } from 'bcrypt'
import prisma from "@/app/utils/prisma";

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