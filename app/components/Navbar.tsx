'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export function Navbar() {
    const { user, error, isLoading } = useUser();

    return (
        <nav className="p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">HireScan</h1>

            <div>
                {!user ? (
                    <Link href="/api/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded">
                        Log In
                    </Link>
                ) : (
                    <Link href="/api/auth/logout" className="px-4 py-2 bg-gray-600 text-white rounded">
                        Log Out
                    </Link>
                )}
            </div>
        </nav>
    );
}
