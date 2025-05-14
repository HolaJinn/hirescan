import { NextResponse } from "next/server";
import { requireUser } from "@/app/utils/hooks";
import prisma from "@/app/utils/prisma";

export async function GET() {
    const session = await requireUser();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobs = await prisma.jobDescription.findMany({
        where: {
            user: { email: session.user.email }
        },
        orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(jobs);
}

export async function POST(req: Request) {
    const session = await requireUser();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description } = await req.json();

    if (!title || !description) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: {
            email: session.user.email!
        }
    })
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const job = await prisma.jobDescription.create({
        data: {
            title,
            description,
            userId: user.id
        }
    })
    return NextResponse.json(job)
}