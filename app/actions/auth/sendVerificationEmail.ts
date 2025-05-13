'use server';

import { Resend } from 'resend';
import { createVerificationToken } from '@/app/utils/tokens';
import { saveTokenToDb } from '@/app/utils/db';

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
            from: 'benamor.yacine@yahoo.fr',
            to: email,
            subject: 'Verify your email',
            html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email address.</p>`,
        });

        return { success: true, message: 'Verification link sent. Check your inbox.' };
    } catch (err) {
        return { success: false, message: 'Failed to send email. Try again later.' };
    }
}