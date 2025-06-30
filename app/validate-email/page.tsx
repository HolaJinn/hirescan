'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import MailIcon from '@/public/mail-icon.png'; // Optional: a mail icon SVG or PNG

export default function EmailValidationPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md text-center py-8 px-4">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Image src={MailIcon} alt="Mail" width={48} height={48} />
          </div>
          <CardTitle className="text-2xl">Check Your Inbox</CardTitle>
          <CardDescription>
            We've sent a verification link to your email. Please confirm your email address to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 text-sm text-muted-foreground">
          Didn't get the email? Make sure to check your spam folder or wait a few minutes.
        </CardContent>
      </Card>
    </div>
  );
}
