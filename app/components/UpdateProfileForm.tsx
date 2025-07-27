// components/forms/update-profile-form.tsx
'use client';

import { useState } from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Props = {
  firstName: string;
  lastName: string;
  email: string;
};

export function UpdateProfileForm({ firstName, lastName, email }: Props) {
  const [formData, setFormData] = useState({
    firstName,
    lastName,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("hello")

    e.preventDefault();
    setIsSubmitting(true);
    const res = await fetch("/api/profile/edit", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setIsSubmitting(false);

    if (res.ok) {
      toast.success("Profile updated successfully");
      redirect("/dashboard/profile")
    } else {
      toast.error("Failed to update profile");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl shadow-xl border border-slate-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName" className="text-sm text-gray-700">
            First Name
          </Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="lastName" className="text-sm text-gray-700">
            Last Name
          </Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="text-sm text-gray-700">
          Email (read-only)
        </Label>
        <Input
          id="email"
          name="email"
          value={email}
          disabled
          className="mt-1 bg-gray-100 text-gray-500 cursor-not-allowed"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
