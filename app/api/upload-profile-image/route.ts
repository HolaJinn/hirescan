// app/api/upload-profile-image/route.ts
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/app/utils/hooks';
import { prisma } from '@/app/utils/prisma';
import { mkdirSync, existsSync } from 'fs';

export async function POST(req: NextRequest) {
  const session = await requireUser();
  const formData = await req.formData();
  const file = formData.get('profileImage') as File;

  if (!file || !file.name) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  
  // Make sure the upload folder exists
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'images');
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = join(uploadDir, fileName);
  const imageUrl = `/uploads/images/${fileName}`;

  await writeFile(filePath, buffer);

  // Update user image
  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: imageUrl },
  });

  return NextResponse.redirect(new URL('/dashboard/profile', req.url));
}
