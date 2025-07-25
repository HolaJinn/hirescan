import { NextResponse } from 'next/server'
import { prisma } from '@/app/utils/prisma'
import { requireUser } from '@/app/utils/hooks';

export async function POST(req: Request) {
  try {
    const session = await requireUser();
    const user = session!.user
    if (!user || !user.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, website, industry, description, logoUrl } = body

    if (!name || name.trim() === '') {
      return NextResponse.json({ message: 'Company name is required.' }, { status: 400 })
    }

    const newCompany = await prisma.company.create({
      data: {
        name,
        website,
        industry,
        description,
        logoUrl,
        users: {
          connect: {
            email: user.email
          }
        }
      }
    })

    return NextResponse.json({ message: 'Company created successfully.', company: newCompany }, { status: 201 })

  } catch (error) {
    console.error('[COMPANY_ONBOARD_ERROR]', error)
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 })
  }
}
