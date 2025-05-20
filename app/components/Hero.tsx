'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
    return (
        <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-purple-100">
            <h1 className="text-5xl font-extrabold text-purple-700 max-w-3xl leading-tight drop-shadow-md">
                Hire Smarter. Match Faster. With AI.
            </h1>
            <p className="mt-6 text-lg text-purple-600 max-w-xl">
                HireScan intelligently screens and matches resumes to job descriptions — helping you find the right candidate in seconds.
            </p>
            <div className="mt-8 flex gap-6">
                <Link href="/api/auth/login">
                    <Button
                        size="lg"
                        className="bg-purple-600 text-white hover:bg-purple-700 shadow-md"
                    >
                        Get Started
                    </Button>
                </Link>
                <Link href="#features">
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-purple-600 text-purple-600 hover:bg-purple-200"
                    >
                        Learn More
                    </Button>
                </Link>
            </div>
        </section>
    );
}
