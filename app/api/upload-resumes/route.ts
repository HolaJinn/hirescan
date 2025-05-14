import { NextRequest, NextResponse } from "next/server"
import { mkdir, writeFile } from "fs/promises"
import fs from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import prisma from "@/app/utils/prisma"
import pdf from "pdf-parse"
import { getResumeMatchScore } from "@/app/utils/edenAI"


export async function POST(req: NextRequest) {
    const formData = await req.formData()
    const files = formData.getAll("resumes") as File[]
    const jobId = formData.get("jobId") as string


    if (!files.length) {
        return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
    }

    // Validate all files are PDFs
    for (const file of files) {
        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { error: `Invalid file type: ${file.name} is not a PDF.` },
                { status: 400 }
            )
        }
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    const savedFiles = []

    const job = await prisma.jobDescription.findUnique({
        where: { id: jobId },
        select: { description: true },
    })

    if (!job) {
        return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    for (const file of files) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uniqueFileName = `${uuidv4()}.pdf`
        const filePath = path.join(uploadDir, uniqueFileName)

        await writeFile(filePath, buffer)
        savedFiles.push({
            name: file.name,
            path: `/uploads/${uniqueFileName}`,
        })

        await prisma.resume.create({
            data: {
                fileUrl: `/uploads/${uniqueFileName}`,
                jobId: jobId
            }
        })

        const dataBuffer = await fs.readFile(filePath)
        const pdfData = await pdf(dataBuffer)
        const resumeText = pdfData.text

        const { score, summary, keyStrengths, keyWeaknesses } = await getResumeMatchScore({
            jobDescription: job.description,
            resumeText,
        });
        console.log(score)
        console.log(summary)
        console.log(keyWeaknesses)
        console.log(keyStrengths)
    }



    return NextResponse.json({ uploaded: savedFiles }, { status: 200 })
}


