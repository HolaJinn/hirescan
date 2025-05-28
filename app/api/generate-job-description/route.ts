// app/api/generate-job-description/route.ts or pages/api/generate-job-description.ts

import { generateJobDescription } from '@/app/utils/generateJobDescription'
import { NextResponse } from 'next/server' // use 'next/server' for app router or 'next' for pages

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { title } = body

        if (!title || typeof title !== 'string') {
            return NextResponse.json({ message: 'Invalid or missing job title' }, { status: 400 })
        }

        const description = await generateJobDescription({ jobTitle: title })
        console.log(description)
        return NextResponse.json({ description })
    } catch (error) {
        console.error('❌ API Error:', error)
        return NextResponse.json({ message: 'Failed to generate job description' }, { status: 500 })
    }
}
