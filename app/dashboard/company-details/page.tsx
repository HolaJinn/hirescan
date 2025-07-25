// app/company/details/page.tsx
import { requireUser } from '@/app/utils/hooks';
import { prisma } from '@/app/utils/prisma';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Building2, Globe2, Info, CalendarDays } from 'lucide-react';
import Link from 'next/link';

export default async function CompanyDetailsPage() {
  const session = await requireUser();
  if (!session?.user) return redirect('/login');
  if (!session.user.companyId) return redirect('/company-onboarding');

  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId },
  });

  if (!company) return <p className="text-center mt-10">Company not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Hero Section */}
        <div className="relative bg-white border rounded-2xl p-8 shadow-lg flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20 ring-2 ring-primary shadow-md">
              <AvatarImage src={company.logoUrl ?? ''} />
              <AvatarFallback className="text-2xl">
                {company.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text">
                {company.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {company.website || 'No website provided'}
              </p>
            </div>
          </div>
          <Link href="/dashboard/company-details/edit">
            <Button variant="default" className="rounded-full px-6 py-2 shadow">
              <Sparkles className="mr-2 h-4 w-4" /> Edit Company
            </Button>
          </Link>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DetailCard
            icon={<Building2 className="text-blue-600" />}
            title="Industry"
            value={company.industry || 'Not specified'}
          />
          <DetailCard
            icon={<CalendarDays className="text-green-600" />}
            title="Created At"
            value={new Date(company.createdAt).toLocaleDateString()}
          />
          <DetailCard
            icon={<Globe2 className="text-purple-600" />}
            title="Website"
            value={company.website || 'No website provided'}
          />
          <DetailCard
            icon={<Info className="text-yellow-600" />}
            title="Description"
            value={company.description || 'No description provided'}
          />
        </div>
      </div>
    </div>
  );
}

function DetailCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <Card className="backdrop-blur bg-white/70 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-6 space-y-2">
        <div className="flex items-center space-x-2 text-muted-foreground">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="text-lg font-semibold text-gray-800">{value}</div>
      </CardContent>
    </Card>
  );
}
