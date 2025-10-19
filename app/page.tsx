"use client";

import { Navigation } from "./components/homepage/Navigation";
import { HeroSection } from "./components/homepage/HeroSection";
import { AwakeningSection } from "./components/homepage/AwakeningSection";
import { RevelationSection } from "./components/homepage/RevelationSection";
import { TransformationSection } from "./components/homepage/TransformationSection";
import { Footer } from "./components/Footer";
import { FounderSection } from "./components/homepage/FounderSection";
import { GuardrailsSection } from "./components/homepage/GuardrailsSection";
import { InvitationSection } from "./components/homepage/InvitationSection";
import { ProductShowcase } from "./components/homepage/ProductShowcase";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: '#0E0E12' }}>
      <Navigation />
      
      <main>
        <HeroSection />
        
        <div id="awakening">
          <AwakeningSection />
        </div>
        
        <div id="revelation">
          <RevelationSection />
        </div>
        
        <div id="transformation">
          <TransformationSection />
        </div>
        
        <div id="showcase">
          <ProductShowcase />
        </div>
        
        <FounderSection />
        
        <GuardrailsSection />
        
        <div id="invitation">
          <InvitationSection />
        </div>
        
        <Footer />
      </main>
    </div>
  );
}