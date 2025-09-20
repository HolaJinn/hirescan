'use client';

import { Suspense } from 'react';
import SigninPageContent from './SigninPageContent';

export default function SigninPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SigninPageContent />
    </Suspense>
  );
}
