'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useState } from 'react';
import { sendVerificationEmail } from '@/app/actions'; // Server action

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const initialState = {
    success: false,
    message: '',
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Sending...' : 'Send Verification Email'}
        </Button>
    );
}

export default function EmailValidationPage() {
    const [state, formAction] = useFormState(sendVerificationEmail, initialState);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>Validate Your Email</CardTitle>
                    <CardDescription>We'll send you a link to verify your email address.</CardDescription>
                </CardHeader>
                <CardContent>
                    {state.message && (
                        <p className={`text-sm mb-4 text-center p-2 rounded ${state.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {state.message}
                        </p>
                    )}

                    <form action={formAction} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required />
                        </div>
                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
