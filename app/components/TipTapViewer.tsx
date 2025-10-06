"use client";

import BulletList from "@tiptap/extension-bullet-list";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import OrderedList from '@tiptap/extension-ordered-list'


export default function TiptapViewer({ content }: { content: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-2",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-2",
        },
      }),
    
    ],
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
