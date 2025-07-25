// app/company/edit/page.tsx
import { redirect } from "next/navigation";
import prisma from "@/app/utils/prisma";
import CompanyForm from "@/app/components/CompanyForm";
import { requireUser } from "@/app/utils/hooks";

export default async function EditCompanyPage() {
  const session = await requireUser();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.companyId) {
    redirect("/company-onboarding");
  }

  const company = await prisma.company.findUnique({
    where: { id: session.user.companyId },
  });

  if (!company) {
    redirect("/company-onboarding");
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Company Details</h1>
      <CompanyForm company={company} />
    </div>
  );
}
