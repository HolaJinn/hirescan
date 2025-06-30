// utils/email.ts
import { Resend } from 'resend';
import { createVerificationToken } from '@/app/utils/tokens';
import { saveTokenToDb } from '@/app/utils/db';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmailByAddress(email: string): Promise<{ success: boolean; message: string }> {
  const token = await createVerificationToken(email);
  await saveTokenToDb(email, token);

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email address.</p>`,
    });

    return { success: true, message: 'Verification email sent.' };
  } catch (err) {
    console.error('Email send error:', err);
    return { success: false, message: 'Failed to send verification email.' };
  }
}
