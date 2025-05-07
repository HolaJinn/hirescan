import { validateToken } from '@/app/utils/tokens';

export default async function VerifyEmailPage({ searchParams }: { searchParams: { token?: string } }) {
    const token = searchParams.token;

    if (!token) {
        return <p className="text-center mt-20 text-red-600">Invalid or missing token.</p>;
    }

    const { valid, message } = await validateToken(token);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className={`p-6 rounded shadow-md text-center ${valid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <h2 className="text-xl font-bold">{valid ? 'Email Verified!' : 'Verification Failed'}</h2>
                <p className="mt-2">{message}</p>
            </div>
        </div>
    );
}
