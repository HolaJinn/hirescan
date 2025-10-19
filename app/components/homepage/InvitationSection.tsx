import { motion } from "motion/react";
import { Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useState } from "react";
import Link from "next/link";

export function InvitationSection() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <section
      className="relative py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #7C3AED 100%)',
      }}
    >
      {/* Connection pattern background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="connection-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="white" opacity="0.5" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="white" strokeWidth="1" opacity="0.3" />
              <line x1="50" y1="50" x2="50" y2="100" stroke="white" strokeWidth="1" opacity="0.3" />
              <line x1="50" y1="50" x2="75" y2="25" stroke="white" strokeWidth="1" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#connection-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-[48px] text-white mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
            Ready to Hire with Both
          </h2>
          <h2
            className="text-[56px] mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              background: 'linear-gradient(to right, #F59E0B, #FBBF24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Intelligence and Heart?
          </h2>
          <p className="text-[20px] text-white/90 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
            Join the companies who've discovered that the best technology doesn't replace people—it makes them more human.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-16">
          {/* Path A - The Explorer */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            onHoverStart={() => setHoveredButton('explorer')}
            onHoverEnd={() => setHoveredButton(null)}
            className="relative"
          >
            <motion.div
              animate={{
                scale: hoveredButton === 'explorer' ? 1.02 : 1,
              }}
              className="glass-morphism rounded-2xl p-8 h-full flex flex-col border-2 border-white/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-[#F59E0B]" />
                <h3 className="text-[24px] text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
                  The Explorer
                </h3>
              </div>

              <p className="text-white/80 text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Perfect for teams who want to understand before committing
              </p>

              <div className="flex-1 mb-6">
                <div className="space-y-3">
                  {[
                    "45-minute strategy session",
                    "Hiring process audit",
                    "Custom recommendations",
                    "No obligation"
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                      <span className="text-white/90 text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                className="w-full group relative overflow-hidden"
                style={{
                  background: 'white',
                  color: '#7C3AED',
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-[#F59E0B]"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Book a Thoughtful Conversation
                  <motion.div
                    animate={{
                      x: hoveredButton === 'explorer' ? 5 : 0,
                    }}
                  >
                    →
                  </motion.div>
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Path B - The Ready-Mover */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            onHoverStart={() => setHoveredButton('ready')}
            onHoverEnd={() => setHoveredButton(null)}
            className="relative"
          >
            <motion.div
              animate={{
                scale: hoveredButton === 'ready' ? 1.02 : 1,
              }}
              className="glass-morphism rounded-2xl p-8 h-full flex flex-col border-2 border-[#F59E0B]"
            >
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-[#F59E0B]" />
                <h3 className="text-[24px] text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
                  The Ready-Mover
                </h3>
              </div>

              <p className="text-white/80 text-sm mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                For teams ready to transform their hiring today
              </p>

              <div className="flex-1 mb-6">
                <div className="space-y-3">
                  {[
                    "Hands-on platform demo",
                    "Real-time workflow setup",
                    "Your actual hiring challenges",
                    "Immediate implementation path"
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                      <span className="text-white/90 text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full group relative overflow-hidden"
                  style={{
                    background: '#F59E0B',
                    color: 'white',
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-[#7C3AED]">
                    Experience the Platform
                    <motion.div
                      animate={{
                        x: hoveredButton === 'ready' ? 5 : 0,
                      }}
                    >
                      →
                    </motion.div>
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-white/80 text-sm" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
            No automated pitches. Just a real conversation about what matters.
          </p>
        </motion.div>
      </div>
    </section>
  );
}