"use client"

import dynamic from "next/dynamic"

const TiptapViewer = dynamic(() => import("./TipTapViewer"), {
  ssr: false,
})

export default function JobDescriptionViewer({ content }: { content: string }) {
  return <TiptapViewer content={content} />
}
