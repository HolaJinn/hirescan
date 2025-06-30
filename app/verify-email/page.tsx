import Link from 'next/link';
import { validateToken } from '@/app/utils/tokens';

export default async function VerifyEmailPage({ searchParams }: { searchParams: { token?: string } }) {
    const token = searchParams.token;

    if (!token) {
        return <p className="text-center mt-20 text-red-600">Invalid or missing token.</p>;
    }

    const { valid, message } = await validateToken(token);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className={`p-6 rounded shadow-md text-center max-w-md w-full ${valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <h2 className="text-xl font-bold">{valid ? 'Email Verified!' : 'Verification Failed'}</h2>
                <p className="mt-2">{message}</p>

                {valid && (
                    <Link href="/login">
                        <button
                            type="button"
                            className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                            Go to Login
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
}
