'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
    return (
        <section className="flex flex-col items-center justify-center text-center px-6 py-24" style={{ backgroundColor: '#FFF2F2' }}>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2D336B] max-w-3xl leading-tight">
                Hire Smarter. Match Faster. With AI.
            </h1>
            <p className="mt-6 text-lg text-[#2D336B]/80 max-w-xl">
                HireScan intelligently screens and matches resumes to job descriptions — helping you find the right candidate in seconds.
            </p>
            <div className="mt-8 flex gap-4">
                <Link href="/api/auth/login">
                    <Button size="lg" style={{ backgroundColor: '#7886C7', color: '#FFF' }}>Get Started</Button>
                </Link>
                <Link href="#features">
                    <Button size="lg" variant="outline" className="border-[#7886C7] text-[#2D336B] hover:bg-[#A9B5DF]/20">Learn More</Button>
                </Link>
            </div>
        </section>
    );
}
