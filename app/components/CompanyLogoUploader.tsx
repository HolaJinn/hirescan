"use client";

import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { UploadCloudIcon } from "lucide-react";

interface CompanyLogoUploaderProps {
  logoUrl: string | null;
  companyName: string;
}

export function CompanyLogoUploader({ logoUrl, companyName }: CompanyLogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(logoUrl ?? null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("logo", file);

    const res = await fetch("/api/company/edit-logo", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.error("Logo upload failed");
    }
  }

  return (
    <div className="relative cursor-pointer group w-fit">
      <Avatar className="h-20 w-20 ring-2 ring-primary shadow-md">
        <AvatarImage src={preview ?? undefined} />
        <AvatarFallback className="text-2xl">
          {companyName?.[0]?.toUpperCase() ?? "C"}
        </AvatarFallback>
      </Avatar>

      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      <div
        onClick={() => inputRef.current?.click()}
        className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
      >
        <UploadCloudIcon className="w-6 h-6 text-white" />
      </div>
    </div>
  );
}
