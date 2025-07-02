import { requireUser } from '@/app/utils/hooks'
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const session = await requireUser();

    if (!session?.user) {
        // Redirect to login if not authenticated
        return redirect('/api/auth/login');
    }
    if (!session?.user.verified) {
        return redirect('/validate-email')
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Welcome {session.user.name}!</h1>
            <h1 className="text-xl font-bold">Welcome MR {session.user.name}!</h1>
        </div>
    );
}
