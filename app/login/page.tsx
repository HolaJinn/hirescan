'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

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
import { Separator } from '@/components/ui/separator';

export default function SigninPage() {
  const searchParams = useSearchParams();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const signupSuccessMessage =
    searchParams.get('status') === 'signup-success'
      ? 'Account created successfully! Please log in.'
      : null;

  const errorParam = searchParams.get('error');
  const errorMessages: Record<string, string> = {
    CredentialsSignin: 'Invalid email or password.',
    default: 'Something went wrong. Please try again later.',
  };
  const errorMessage = errorParam ? errorMessages[errorParam] ?? errorMessages.default : null;

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/dashboard',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-2xl overflow-hidden bg-white">
        {/* Left Section - Branding */}
        <div className="hidden md:flex flex-col justify-center items-center bg-purple-100 p-10">
          <h2 className="text-3xl font-bold text-purple-700 text-center">Welcome Back</h2>
          <p className="text-center text-sm mt-4 text-purple-600">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Right Section - Form */}
        <div className="p-8">
          <Card className="border-none shadow-none">
            <CardHeader className="text-center px-0">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>Welcome back! Sign in to your account.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              {signupSuccessMessage && (
                <p className="text-sm text-green-600 mb-4 text-center p-2 bg-green-50 rounded">
                  {signupSuccessMessage}
                </p>
              )}

              {errorMessage && (
                <p className="text-sm text-red-600 mb-4 text-center p-2 bg-red-50 rounded">
                  {errorMessage}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>

                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>

              <Separator className="my-6" />

              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? 'Redirecting...' : 'Sign In with Google'}
              </Button>
            </CardContent>
            <CardFooter className="justify-center text-sm px-0">
              <span>Don't have an account?&nbsp;</span>
              <Link href="/signup" className="font-medium text-purple-600 hover:underline">
                Sign up
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
