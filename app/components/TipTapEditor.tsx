"use client"

import { useEffect, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Bold from "@tiptap/extension-bold"
import Italic from "@tiptap/extension-italic"
import Heading from "@tiptap/extension-heading"
import Underline from "@tiptap/extension-underline"

import { Button } from "@/components/ui/button"
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  List as BulletListIcon,
  ListOrdered as OrderedListIcon,
  Heading1,
  Heading2,
} from "lucide-react"

import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'


interface TiptapEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Bold,
      Italic,
      Underline,
      Heading.configure({ levels: [1, 2] }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  })




  if (!mounted || !editor) return null

  const ToolbarButton = ({
    icon: Icon,
    isActive,
    onClick,
    label,
  }: {
    icon: React.ElementType
    isActive: boolean
    onClick: () => void
    label: string
  }) => (
    <Button
      type="button"
      size="sm"
      variant={isActive ? "default" : "ghost"}
      onClick={onClick}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )

  return (
    <div className="space-y-2 border rounded-md p-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b pb-2 mb-2">
        <ToolbarButton
          icon={BoldIcon}
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="Bold"
        />
        <ToolbarButton
          icon={ItalicIcon}
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="Italic"
        />
        <ToolbarButton
          icon={UnderlineIcon}
          isActive={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          label="Underline"
        />
        <ToolbarButton
          icon={BulletListIcon}
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="Bullet List"
        />
        <ToolbarButton
          icon={OrderedListIcon}
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          label="Numbered List"
        />

        <ToolbarButton
          icon={Heading1}
          isActive={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          label="Heading 1"
        />
        <ToolbarButton
          icon={Heading2}
          isActive={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          label="Heading 2"
        />
      </div>

      <div className="border rounded-md p-2 min-h-[250px]">
        <EditorContent
          editor={editor}
          className="focus:outline-none min-h-[200px] list-inside list-disc prose-sm"
          style={{ whiteSpace: 'pre-wrap' }}
        />

      </div>

    </div>
  )
}
