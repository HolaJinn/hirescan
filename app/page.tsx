import { Hero } from "@/app/components/Hero";
import { Features } from "@/app/components/Features";
import { Footer } from "@/app/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
