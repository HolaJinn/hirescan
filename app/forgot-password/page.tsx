'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { sendResetPasswordEmail } from '@/app/actions/auth/sendResetPasswordEmail'; // ✅ Import the new function

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsSubmitting(true);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError('Please enter a valid email address.');
    setIsSubmitting(false);
    return;
  }

  try {
    await sendResetPasswordEmail(email); // ✅ Correctly pass an object
    setSubmitted(true);
  } catch (err: any) {
    setError(err.message || 'Something went wrong');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full">
        <Card className="p-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-purple-700">Forgot Password</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Enter your email address and we’ll send you a reset link.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {submitted ? (
              <p className="text-center text-green-600 bg-green-50 p-3 rounded">
                If an account with that email exists, a reset link has been sent.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="justify-center text-sm">
            <Link href="/login" className="text-purple-600 hover:underline">
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
