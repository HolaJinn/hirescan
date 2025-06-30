'use client';

import { Button } from "@/components/ui/button";
import { toast } from "sonner"


export default function CopyApplyLinkButton({ jobId }: { jobId: string }) {
  const handleCopy = () => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/jobs/${jobId}/apply`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Application link copied! ✅")
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-xs"
      onClick={handleCopy}
    >
      Copy Apply Link
    </Button>
  );
}
