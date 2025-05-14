import { NextResponse } from "next/server";
import { requireUser } from "@/app/utils/hooks";
import prisma from "@/app/utils/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await requireUser();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description } = await req.json();

    const job = await prisma.jobDescription.findUnique({
        where: { id: params.id },
        include: { user: true }
    })

    if (!job) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (job.user.email !== session.user.email) {
        return NextResponse.json({ error: "Unauthorized to modify this job description" }, { status: 403 })
    }

    const updated = await prisma.jobDescription.update({
        where: { id: params.id },
        data: { title, description }
    })

    return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await requireUser();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const job = await prisma.jobDescription.findUnique({
        where: { id: params.id },
        include: { user: true }
    })

    if (!job) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (job.user.email !== session.user.email) {
        return NextResponse.json({ error: "Unauthorized to modify this job description" }, { status: 403 })
    }

    await prisma.jobDescription.delete({
        where: { id: params.id }
    })

    return NextResponse.json({ success: true })
}