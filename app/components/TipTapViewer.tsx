"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function TiptapViewer({ content }: { content: string }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false, // 🔒 read-only 
    immediatelyRender: false, // ✅ avoid SSR hydration mismatches

  });

  return (
    <div className="prose max-w-none">
      <EditorContent editor={editor} />
    </div>
  );
}
