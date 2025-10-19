import { motion } from "motion/react";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button"
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden grain-texture" style={{ background: 'linear-gradient(to bottom, #0E0E12, #1A1A1D)' }}>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-16 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-[72px] leading-[1.1] text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
                Stop Choosing Between
              </h1>
              <h1 className="text-[72px] leading-[1.1]" style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 300,
                background: 'linear-gradient(to right, #7C3AED, #8B5CF6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Efficiency & Humanity
              </h1>
            </div>

            <p className="text-[20px] text-[#A1A1AA] leading-[1.6] max-w-xl" style={{ fontFamily: "'Inter', sans-serif" }}>
              HireScan is the first AI platform that understands some decisions are too important for algorithms alone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="group relative overflow-hidden px-8 py-6 transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)',
                    color: 'white',
                    border: '1px solid #F59E0B',
                    boxShadow: '0 0 30px rgba(124, 58, 237, 0.3)',
                  }}
                >
                  <span className="relative z-10">Experience Intelligent Hiring</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </Link>

              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="group glass-morphism px-8 py-6 hover:scale-105 transition-all"
                  style={{
                    color: 'black',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  Start Hiring
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex items-center gap-3 pt-8"
            >
              <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
              <p className="text-[16px] text-[#A1A1AA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="text-white" style={{ fontWeight: 500 }}>3,842+</span> hours of recruiter time saved this week
              </p>
            </motion.div>
          </motion.div>

          {/* Right: Dashboard Visual */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="glass-morphism rounded-2xl p-8 shadow-2xl"
              style={{
                boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.25)',
              }}
            >
              {/* Dashboard mockup */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-xl" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Candidate Matching</h3>
                  <div className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(124, 58, 237, 0.2)', color: '#8B5CF6', fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
                    AI + Human
                  </div>
                </div>

                {/* Mock candidate cards */}
                {[
                  {
                    name: 'Sarah Chen',
                    match: 94,
                    role: 'Senior Engineer',
                    imageUrl: '/femaleAvatar.svg'
                  },
                  {
                    name: 'Marcus Rodriguez',
                    match: 89,
                    role: 'Product Manager',
                    imageUrl: '/maleAvatar.svg' // 🔁 replace later
                  },
                  {
                    name: 'Elena Volkov',
                    match: 87,
                    role: 'Design Lead',
                    imageUrl: '/femaleAvatar.svg' // 🔁 replace later
                  },
                ].map((candidate, i) => (
                  <motion.div
                    key={candidate.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.2 }}
                    className="glass-morphism rounded-lg p-4 hover:border-[#7C3AED] transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={candidate.imageUrl}
                          alt={candidate.name}
                          className="w-12 h-12 rounded-full object-cover border border-[#7C3AED]/40"
                        />
                        <div>
                          <h4 className="text-white text-sm font-semibold">{candidate.name}</h4>
                          <p className="text-[#A1A1AA] text-xs">{candidate.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#F59E0B] text-xl font-semibold">{candidate.match}%</div>
                        <p className="text-[#A1A1AA] text-xs">Match</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}