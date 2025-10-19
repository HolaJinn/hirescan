import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export function Navigation() {
  const { scrollYProgress } = useScroll();
  const [showBackToTop, setShowBackToTop] = useState(false);

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["rgba(14, 14, 18, 0)", "rgba(14, 14, 18, 0.95)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sections = [
    { label: "Story", href: "#awakening" },
    { label: "Approach", href: "#revelation" },
    { label: "Results", href: "#transformation" },
    { label: "Platform", href: "#showcase" },
    { label: "Get Started", href: "#invitation" },
  ];

  return (
    <>
      {/* Fixed header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
        style={{ backgroundColor }}
      >
        <div className="container mx-auto px-16">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              className="text-2xl text-white"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              HireScan
            </motion.a>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-8">
              {sections.map((section, index) => (
                <motion.a
                  key={index}
                  href={section.href}
                  className="text-[#A1A1AA] hover:text-white transition-colors text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  whileHover={{ y: -2 }}
                >
                  {section.label}
                </motion.a>
              ))}
            </nav>

            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="hidden md:block px-6 py-2 rounded-lg text-sm text-white"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                }}
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Progress indicator */}
      <motion.div
        className="fixed top-20 left-0 right-0 h-1 bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Back to top button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center z-50 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
        }}
      >
        <ArrowUp className="w-5 h-5 text-white" />
      </motion.button>
    </>
  );
}