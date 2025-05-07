// app/auth/signup/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signupWithEmail } from '@/app/actions';
import { signIn } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const initialState: { success: boolean; message: string; errors?: any[] } = {
    success: false,
    message: '',
    errors: undefined,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={pending}>
            {pending ? 'Creating Account...' : 'Create Account'}
        </Button>
    );
}

export default function SignupPage() {
    const router = useRouter();
    const [state, formAction] = useFormState(signupWithEmail, initialState);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    useEffect(() => {
        if (state.success) {
            redirect('/validate-email')
        }
    }, [state.success, state.message, router]);

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        await signIn('google', { callbackUrl: '/dashboard' });
    };

    const getFieldError = (fieldName: string): string | undefined => {
        return state.errors?.find(err => err.path.includes(fieldName))?.message;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-purple-50 px-4">
            <Card className="w-full max-w-md shadow-lg border border-purple-200">
                <CardHeader className="text-center">
                    <CardTitle className="text-purple-700">Create an Account</CardTitle>
                    <CardDescription>Enter your details below or use Google</CardDescription>
                </CardHeader>
                <CardContent>
                    {!state.success && state.message && !state.errors && (
                        <p className="text-sm text-red-600 mb-4 text-center p-2 bg-red-100 rounded">{state.message}</p>
                    )}
                    {!state.success && state.message === 'Please correct the errors below.' && (
                        <p className="text-sm text-red-600 mb-4 text-center p-2 bg-red-100 rounded">{state.message}</p>
                    )}

                    <form action={formAction} className="space-y-4">
                        {/* First Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" name="firstName" placeholder="Your First Name" required />
                            {getFieldError('firstName') && <p className="pt-1 text-xs text-red-600">{getFieldError('firstName')}</p>}
                        </div>

                        {/* Last Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" name="lastName" placeholder="Your Last Name" required />
                            {getFieldError('lastName') && <p className="pt-1 text-xs text-red-600">{getFieldError('lastName')}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                            {getFieldError('email') && <p className="pt-1 text-xs text-red-600">{getFieldError('email')}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                            {getFieldError('password') && <p className="pt-1 text-xs text-red-600">{getFieldError('password')}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                            <Input id="passwordConfirmation" name="passwordConfirmation" type="password" required />
                            {getFieldError('passwordConfirmation') && <p className="pt-1 text-xs text-red-600">{getFieldError('passwordConfirmation')}</p>}
                        </div>

                        <SubmitButton />
                    </form>

                    <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-purple-300"></div>
                        <span className="mx-4 text-xs text-purple-500 uppercase">OR</span>
                        <div className="flex-grow border-t border-purple-300"></div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full border-purple-300 text-purple-700"
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading}
                    >
                        {isGoogleLoading ? 'Redirecting...' : 'Continue with Google'}
                    </Button>
                </CardContent>
                <CardFooter className="justify-center text-sm">
                    <span>Already have an account?&nbsp;</span>
                    <Link href="/signin" className="font-medium text-purple-600 hover:underline">
                        Log in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
