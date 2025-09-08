'use server';

import { z } from 'zod';
import { hash } from 'bcrypt';
import prisma from '@/app/utils/prisma';
import { sendVerificationEmailByAddress } from '@/app/utils/email';
import { requireUser } from '@/app/utils/hooks';

const AddRecruiterSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function addRecruiter(prevState: {
    success: boolean;
    message: string;
    errors?: any;
},
    formData: FormData) {
    const session = await requireUser()

    if (!session || !session.user || !session.user.email) {
        return {
            success: false,
            message: 'Unauthorized access.',
        };
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { company: true },
    });

    if (!currentUser || !currentUser.companyId) {
        return {
            success: false,
            message: 'Current user does not belong to a company.',
        };
    }

    const validated = AddRecruiterSchema.safeParse({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validated.success) {
        return {
            success: false,
            message: 'Validation error',
            errors: validated.error.flatten().fieldErrors,
        };
    }

    const { firstName, lastName, email, password } = validated.data;

    const existingRecruiter = await prisma.user.findUnique({
        where: { email },
    });

    if (existingRecruiter) {
        return {
            success: false,
            message: 'A user with this email already exists.',
        };
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: 'recruiter',
            companyId: currentUser.companyId,
            verified: true
        },
    });


    return {
        success: true,
        message: 'Recruiter added and verification email sent.',
    };
}
