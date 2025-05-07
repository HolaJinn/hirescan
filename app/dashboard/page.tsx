import { auth } from '@/app/utils/auth'
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        // Redirect to login if not authenticated
        return redirect('/api/auth/login');
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Welcome {session.user.name}!</h1>
        </div>
    );
}
