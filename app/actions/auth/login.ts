'use server';

import { signIn } from '@/app/utils/auth'; // Import server-side signIn

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

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
        return { success: false, message: 'Please enter both email and password.' };
    }

    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: '/dashboard',
        });
        console.warn(`signIn for ${email} completed without redirect or expected error.`);
        return { success: false, message: 'Login processed but no redirect occurred.' };
    } catch (error) {
        console.error('Login Error:', error);
        throw error;
    }
}