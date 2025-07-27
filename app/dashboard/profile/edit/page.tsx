// app/(dashboard)/profile/edit/page.tsx
import { UpdateProfileForm } from "@/app/components/UpdateProfileForm";
import { requireUser } from "@/app/utils/hooks";

export default async function EditProfilePage() {
  const session = await requireUser();
  const user = session.user;

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Edit Your Profile</h1>
      <UpdateProfileForm
        firstName={user.firstName ?? ""}
        lastName={user.lastName ?? ""}
        email={user.email ?? ""}
      />
    </div>
  );
}
