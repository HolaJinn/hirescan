import { NextResponse } from "next/server";
import { requireUser } from "@/app/utils/hooks";
import prisma from "@/app/utils/prisma";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    const session = await requireUser();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const {id} = await context.params;
    const { title, description } = await req.json();

    const job = await prisma.jobDescription.findUnique({
        where: { id: id },
        include: { user: true }
    })

    if (!job) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (job.user.email !== session.user.email) {
        return NextResponse.json({ error: "Unauthorized to modify this job description" }, { status: 403 })
    }

    const updated = await prisma.jobDescription.update({
        where: { id },
        data: { title, description }
    })

    return NextResponse.json(updated)
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    const session = await requireUser();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const {id} = await context.params;

    const job = await prisma.jobDescription.findUnique({
        where: { id },
        include: { user: true }
    })

    if (!job) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (job.user.email !== session.user.email) {
        return NextResponse.json({ error: "Unauthorized to modify this job description" }, { status: 403 })
    }

    await prisma.jobDescription.delete({
        where: { id }
    })

    return NextResponse.json({ success: true })
}