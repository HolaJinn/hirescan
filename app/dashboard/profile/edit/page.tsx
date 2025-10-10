import { UpdateProfileForm } from "@/app/components/UpdateProfileForm";
import { requireUser } from "@/app/utils/hooks";
import { prisma } from '@/app/utils/prisma';


export default async function EditProfilePage() {
  const session = await requireUser();

  const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    });

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Your Profile</h1>
      <UpdateProfileForm
        firstName={currentUser!.firstName ?? ""}
        lastName={currentUser!.lastName ?? ""}
        email={currentUser!.email ?? ""}
      />
    </div>
  );
}
