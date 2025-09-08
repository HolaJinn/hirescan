'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addRecruiter } from '@/app/actions/recruiters/add-recruiter'; // You’ll create this
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const initialState = {
  success: false,
  message: '',
  errors: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={pending}>
      {pending ? 'Adding...' : 'Add Recruiter'}
    </Button>
  );
}

export default function AddRecruiterPage() {
  const router = useRouter();
  const [state, formAction] = useFormState(addRecruiter, initialState);

  useEffect(() => {
    if (state.success) {
      router.push('/dashboard/recruiters');
    }
  }, [state.success, router]);

  const getFieldError = (fieldName: string): string | undefined => {
    return state.errors?.find((err: any) => err.path.includes(fieldName));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-blue-700">Add a New Recruiter</CardTitle>
          <CardDescription>Fill in the details to add another recruiter to your team.</CardDescription>
        </CardHeader>
        <CardContent>
          {state.message && !state.success && (
            <p className="text-sm text-red-600 mb-4 text-center p-2 bg-red-100 rounded">{state.message}</p>
          )}

          <form action={formAction} className="space-y-4">
            {/* First Name */}
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" required />
              {getFieldError('firstName') && <p className="pt-1 text-xs text-red-600">{getFieldError('firstName')}</p>}
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" required />
              {getFieldError('lastName') && <p className="pt-1 text-xs text-red-600">{getFieldError('lastName')}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
              {getFieldError('email') && <p className="pt-1 text-xs text-red-600">{getFieldError('email')}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {getFieldError('password') && <p className="pt-1 text-xs text-red-600">{getFieldError('password')}</p>}
            </div>

            <SubmitButton />
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Recruiters will be linked to your company automatically.
        </CardFooter>
      </Card>
    </div>
  );
}
