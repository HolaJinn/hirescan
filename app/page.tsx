"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/hirescanlogo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Users,
  CheckCircle,
  FileText,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src={Logo}
              alt="HireScan Logo"
              width={130}
              height={130}
              className="rounded-md"
            />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Smarter Hiring, Powered by AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            HireScan helps recruiters create job descriptions, collect
            applications, and instantly see how candidates match — all in one
            secure platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard/jobs">
              <Button className="bg-purple-700 text-white hover:bg-purple-800 px-6 py-2 text-lg rounded-xl">
                Start Hiring
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                className="border-purple-700 text-purple-700 hover:bg-purple-100 px-6 py-2 text-lg rounded-xl"
              >
                Create an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why HireScan?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Briefcase className="h-8 w-8 text-purple-700" />,
                title: "AI-Powered Matching",
                desc: "Upload resumes and get instant, accurate fit scores for each candidate.",
              },
              {
                icon: <Users className="h-8 w-8 text-purple-700" />,
                title: "Effortless Collaboration",
                desc: "Easily share job links and collaborate with your hiring team.",
              },
              {
                icon: <FileText className="h-8 w-8 text-purple-700" />,
                title: "Streamlined Applications",
                desc: "Candidates can apply in seconds, no account required.",
              },
            ].map((feature, i) => (
              <Card key={i} className="shadow-md border rounded-xl">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-xl mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              "Recruiter creates a job post",
              "Candidates upload resumes",
              "AI analyzes & scores applications",
              "Recruiters see ranked matches",
            ].map((step, i) => (
              <Card
                key={i}
                className="border shadow-sm rounded-xl bg-gray-50"
              >
                <CardContent className="p-6">
                  <div className="text-purple-700 font-bold text-2xl mb-2">
                    {i + 1}
                  </div>
                  <p className="text-gray-700">{step}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-700 to-purple-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Streamline Your Hiring?
          </h2>
          <p className="mb-8 text-lg text-purple-200">
            Whether you're hiring or applying, HireScan is your smart assistant.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard/jobs">
              <Button className="bg-white text-purple-800 hover:bg-gray-100 px-6 py-2 text-lg rounded-xl">
                Start Hiring
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                className="border-white text-purple-800 bg-white hover:bg-gray-100 px-6 py-2 text-lg rounded-xl"
              >
                Create an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
