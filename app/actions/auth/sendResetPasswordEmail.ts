'use server';

import { Resend } from 'resend';
import { createPasswordResetToken } from '@/app/utils/tokens';
import { saveResetTokenToDb } from '@/app/utils/db';

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Accept just an email string instead of FormData
export async function sendResetPasswordEmail(email: string) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  const token = await createPasswordResetToken(email);
  await saveResetTokenToDb(email, token);

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: 'benamor.yacine@yahoo.fr',
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    });

    return { success: true, message: 'Reset link sent. Check your inbox.' };
  } catch (err) {
    return { success: false, message: 'Failed to send email. Try again later.' };
  }
}
