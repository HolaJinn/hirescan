"use client"

import { useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { UploadCloudIcon } from "lucide-react"

interface AvatarUploaderProps {
  imageUrl: string | null
  firstName?: string | null
  lastName?: string | null
  onUpload?: (file: File) => void
}

export function AvatarUploader({
  imageUrl,
  firstName,
  lastName,
  onUpload,
}: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(imageUrl ?? null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('profileImage', file)

    const res = await fetch('/api/upload-profile-image', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      console.error("Upload failed")
    }

    if (onUpload) onUpload(file)
  }

  const fallbackInitials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}` || "U"

  return (
    <div className="relative cursor-pointer group w-fit">
      <Avatar className="h-20 w-20">
        <AvatarImage
          src={preview ?? undefined}
          className="h-full w-full object-cover"
        />
        <AvatarFallback className="text-xl">
          {fallbackInitials.toUpperCase()}
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
  )
}
