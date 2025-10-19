import { motion } from "motion/react";
import { Brain, Heart, ArrowRight } from "lucide-react";

const aiRoles = [
  "Pattern recognition at scale",
  "Bias detection & removal",
  "Skill gap analysis",
  "Market benchmarking"
];

const humanRoles = [
  "Cultural intuition",
  "Leadership potential",
  "Team dynamics",
  "Growth trajectory"
];

export function RevelationSection() {
  return (
    <section className="relative py-32 overflow-hidden" style={{ background: '#0E0E12' }}>
      {/* Neural network background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="neural-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#7C3AED" opacity="0.5" />
              <line x1="50" y1="50" x2="100" y2="0" stroke="#7C3AED" strokeWidth="0.5" opacity="0.3" />
              <line x1="50" y1="50" x2="100" y2="100" stroke="#7C3AED" strokeWidth="0.5" opacity="0.3" />
              <line x1="50" y1="50" x2="0" y2="100" stroke="#7C3AED" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-[48px] text-white leading-tight max-w-4xl mx-auto" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
            We Stopped Trying to Replace Judgment and Started{' '}
            <span style={{ 
              background: 'linear-gradient(to right, #7C3AED, #8B5CF6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Amplifying It
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center max-w-6xl mx-auto">
          {/* AI's Role */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <Brain className="w-10 h-10 text-[#7C3AED]" />
              <h3 className="text-[32px] text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
                AI's Role
              </h3>
            </div>
            
            <div className="space-y-4">
              {aiRoles.map((role, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 group cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full bg-[#7C3AED] mt-2 group-hover:scale-150 transition-transform" />
                  <p className="text-[18px] text-[#A1A1AA] group-hover:text-white transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {role}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Center Insight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-32 h-32 mb-6"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] opacity-20 blur-xl" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center">
                <ArrowRight className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <p className="text-[20px] text-center text-white leading-relaxed max-w-xs" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              The magic happens in the{' '}
              <span className="text-[#F59E0B]" style={{ fontWeight: 600 }}>handoff</span>
              —when data meets wisdom.
            </p>
          </motion.div>

          {/* Human's Role */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <Heart className="w-10 h-10 text-[#F59E0B]" />
              <h3 className="text-[32px] text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
                Human's Role
              </h3>
            </div>
            
            <div className="space-y-4">
              {humanRoles.map((role, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 group cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full bg-[#F59E0B] mt-2 group-hover:scale-150 transition-transform" />
                  <p className="text-[18px] text-[#A1A1AA] group-hover:text-white transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {role}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}