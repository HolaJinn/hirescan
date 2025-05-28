import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/utils/prisma"

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params
    const body = await req.json()
    const newStatus = body.status as "OPEN" | "PAUSED" | "CLOSED" | "DRAFT"

    if (!id || !newStatus) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    await prisma.jobDescription.update({
        where: { id: id },
        data: { status: newStatus },
    })

    return NextResponse.json({ success: true })
}
