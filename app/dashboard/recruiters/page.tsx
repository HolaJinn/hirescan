import { prisma } from "@/app/utils/prisma"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { requireUser } from '@/app/utils/hooks';

export default async function RecruitersPage() {
  const session = await requireUser()

  if (!session?.user?.email) {
    return <p className="text-sm text-muted-foreground">Unauthorized access.</p>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, companyId: true }
  });

  const showCreateCompanyBanner = user?.role === "owner" && !user?.companyId;

  // Fetch all company members (owner + recruiters)
  let companyMembers: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    role: string;
  }[] = [];

  if (!showCreateCompanyBanner) {
    companyMembers = await prisma.user.findMany({
      where: { companyId: user?.companyId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {showCreateCompanyBanner ? (
        // 🚧 Company onboarding banner
        <Card className="border-dashed border-2 border-yellow-400 bg-yellow-50/30 shadow-none">
          <CardHeader>
            <CardTitle className="text-yellow-700">🚧 Company Profile Incomplete</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700 mb-4">
              You haven’t completed your company profile yet. Please set it up before inviting recruiters.
            </p>
            <Link href="/dashboard/company-onboarding">
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition">
                Complete Company Profile
              </button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Company Members</h1>
              <p className="text-muted-foreground text-sm mt-1">
                This is the list of all people in your company.
              </p>
            </div>

            {/* ✅ Only owners see this button */}
            {user?.role === "owner" && (
              <Link href="/dashboard/recruiters/add">
                <Button variant="default" className="rounded-full px-6 py-2 shadow">
                  <Sparkles className="mr-1 h-4 w-4" /> Add Recruiters
                </Button>
              </Link>
            )}
          </div>

          <Separator className="mb-6" />

          {companyMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No members found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {companyMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        {member.firstName} {member.lastName}
                      </CardTitle>
                      {/* ✅ Role badge */}
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full
                        ${member.role === "owner"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"}`}>
                        {member.role}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
