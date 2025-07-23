import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function saveTokenToDb(email: string, token: string) {
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiry

    await prisma.emailVerificationToken.create({
        data: {
            email,
            token,
            expires,
        },
    });
}

export async function saveResetTokenToDb(email: string, token: string) {
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
}


export async function fetchTokenRecordFromDb(token: string) {
    return prisma.emailVerificationToken.findUnique({
        where: { token },
    });
}

export async function markEmailAsVerified(email: string) {
    await prisma.user.upsert({
        where: { email },
        update: { verified: true },
        create: {
            email,
            verified: true,
        },
    });
}
