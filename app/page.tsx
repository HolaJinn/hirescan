import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/hirescanlogo.png';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

export default function HomePage() {
  return (
    <main className="bg-purple-50 min-h-screen text-purple-900">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <div className="flex justify-center mb-6">
          <Image src={Logo} alt="HireScan Logo" width={150} height={150} className="rounded-lg" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Streamline Your Hiring Process</h1>
        <p className="text-lg mb-6 max-w-xl mx-auto">
          HireScan uses AI to analyze and match resumes, helping recruiters find the right candidates faster — and helping candidates apply effortlessly.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/dashboard/jobs">
            <Button className="bg-purple-700 text-white hover:bg-purple-800">Start Hiring</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-100">Create an Account</Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-4">For Recruiters</h2>
            <ul className="space-y-2 text-purple-800">
              <li>✓ Upload resumes and receive instant AI match scores</li>
              <li>✓ Track and manage applicants efficiently</li>
              <li>✓ Share public job application links effortlessly</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">For Candidates</h2>
            <ul className="space-y-2 text-purple-800">
              <li>✓ Apply in seconds — no account needed</li>
              <li>✓ Upload your resume for instant submission</li>
              <li>✓ Mobile-friendly application process</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Section (Carousel) */}
      <section className="py-12 px-4 bg-purple-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6">How HireScan Works</h2>
          <Carousel className="w-full max-w-xl mx-auto">
            <CarouselContent>
              <CarouselItem className="text-purple-800 text-lg">1. Recruiter creates a job posting</CarouselItem>
              <CarouselItem className="text-purple-800 text-lg">2. Resumes are submitted or uploaded</CarouselItem>
              <CarouselItem className="text-purple-800 text-lg">3. Our AI parses and evaluates each resume</CarouselItem>
              <CarouselItem className="text-purple-800 text-lg">4. Recruiters instantly see ranked matches</CarouselItem>
            </CarouselContent>
            <div className="flex justify-center mt-4 gap-4">
              <CarouselPrevious className="bg-purple-600 text-white hover:bg-purple-700" />
              <CarouselNext className="bg-purple-600 text-white hover:bg-purple-700" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="mb-6">Whether you're hiring or applying, HireScan is your smart assistant.</p>
        <div className="flex justify-center gap-4">
          <Link href="/dashboard/jobs">
            <Button className="bg-purple-700 text-white hover:bg-purple-800">Start Hiring</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" className="border-purple-700 text-purple-700 hover:bg-purple-100">Create an Account</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
