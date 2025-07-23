import { randomBytes } from 'crypto';
import {
    fetchTokenRecordFromDb,
    markEmailAsVerified,
} from './db';

export async function createVerificationToken(email: string) {
    const token = randomBytes(32).toString('hex');
    // Save this with expiration in DB (not shown here)
    return token;
}

export async function validateToken(token: string) {
    // Fetch from DB by token
    const record = await fetchTokenRecordFromDb(token); // Your DB function
    const expires = new Date();
    if (expires.getTime() < Date.now()) {
        return { valid: false, message: 'Invalid or expired token.' };
    }

    // Optionally, mark email as verified in DB
    await markEmailAsVerified(record!.email);

    return { valid: true, message: 'Your email has been successfully verified!' };
}

export async function createPasswordResetToken(email: string) {
  const token = randomBytes(32).toString('hex');
  return token;
}
