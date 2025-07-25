'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function CompanyOnboardingPage() {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: '',
    description: '',
    logoUrl: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const res = await fetch('/api/company-onboard', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (res.ok) {
      router.push('/dashboard')
    } else {
      console.error(await res.json())
    }

    setIsSubmitting(false)
  }

  return (
    <div className="max-w-3xl mx-auto mt-16 px-4">
      <Card className="shadow-lg border rounded-2xl">
        <CardContent className="p-8">
          <h1 className="text-2xl font-semibold mb-6">Company Onboarding</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="block mb-2 text-sm font-medium">
                Company Name
              </Label>
              <Input
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Acme Inc."
              />
            </div>

            <div>
              <Label htmlFor="website" className="block mb-2 text-sm font-medium">
                Website
              </Label>
              <Input
                name="website"
                id="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>

            <div>
              <Label htmlFor="industry" className="block mb-2 text-sm font-medium">
                Industry
              </Label>
              <Input
                name="industry"
                id="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. Software, Finance, Healthcare"
              />
            </div>

            <div>
              <Label htmlFor="description" className="block mb-2 text-sm font-medium">
                Company Description
              </Label>
              <Textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us more about your company..."
              />
            </div>

            <div>
              <Label htmlFor="logoUrl" className="block mb-2 text-sm font-medium">
                Logo URL
              </Label>
              <Input
                name="logoUrl"
                id="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://yourcdn.com/logo.png"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
              {isSubmitting ? 'Submitting...' : 'Save Company Info'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
