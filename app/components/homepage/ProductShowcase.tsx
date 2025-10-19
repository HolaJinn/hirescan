import { motion } from "motion/react";
import { Users, BarChart3, MessageSquare, Star } from "lucide-react";

export function ProductShowcase() {
  return (
    <section className="relative py-32 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #0E0E12, #1A1A1D)' }}>
      <div className="container mx-auto px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-[48px] text-white mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
            Intelligence Made Beautiful
          </h2>
          <p className="text-[20px] text-[#A1A1AA]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
            Every pixel serves a purpose. Every interaction feels intentional.
          </p>
        </motion.div>

        {/* 3D Dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative max-w-6xl mx-auto"
          style={{ perspective: '1000px' }}
        >
          <motion.div
            animate={{
              rotateY: [0, 5, 0],
              rotateX: [0, -2, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="glass-morphism rounded-2xl p-8 shadow-2xl"
            style={{
              boxShadow: '0 50px 100px -20px rgba(124, 58, 237, 0.3)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Main dashboard area */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <h3 className="text-white text-2xl" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                  Hiring Dashboard
                </h3>
                <div className="flex gap-2">
                  {[Users, BarChart3, MessageSquare].map((Icon, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      className="w-10 h-10 rounded-lg glass-morphism flex items-center justify-center"
                    >
                      <Icon className="w-5 h-5 text-[#7C3AED]" />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Grid of cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Candidate profile card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="glass-morphism rounded-xl p-6 hover:border-[#7C3AED] transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src="/maleAvatar.svg"
                      alt="Alex Thompson"
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="text-white text-lg mb-1" style={{ fontWeight: 600 }}>Alex Thompson</h4>
                      <p className="text-[#A1A1AA] text-sm">Full Stack Engineer</p>
                      <div className="flex items-center gap-2 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A1A1AA]">Technical Match</span>
                      <span className="text-[#7C3AED]" style={{ fontWeight: 600 }}>96%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '96%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(to right, #7C3AED, #8B5CF6)' }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#A1A1AA]">Cultural Fit</span>
                      <span className="text-[#F59E0B]" style={{ fontWeight: 600 }}>89%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '89%' }}
                        transition={{ duration: 1, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="h-full bg-[#F59E0B] rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Team collaboration card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="glass-morphism rounded-xl p-6 hover:border-[#7C3AED] transition-all"
                >
                  <h4 className="text-white text-lg mb-4" style={{ fontWeight: 600 }}>Team Feedback</h4>
                  <div className="space-y-3">
                    {[
                      {
                        name: 'Sarah K.',
                        role: 'Engineering Lead',
                        comment: 'Strong technical depth',
                        imageUrl: '/femaleAvatar.svg' // placeholder, replace later
                      },
                      {
                        name: 'Marcus R.',
                        role: 'HR Director',
                        comment: 'Great culture alignment',
                        imageUrl: '/maleAvatar.svg' // placeholder
                      },
                      {
                        name: 'Lisa M.',
                        role: 'CTO',
                        comment: 'Excellent growth potential',
                        imageUrl: '/femaleAvatar.svg' // placeholder
                      }
                    ].map((feedback, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                      >
                        <img
                          src={feedback.imageUrl}
                          alt={feedback.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white text-sm" style={{ fontWeight: 600 }}>{feedback.name}</p>
                            <span className="text-[#A1A1AA] text-xs">· {feedback.role}</span>
                          </div>
                          <p className="text-[#A1A1AA] text-xs mt-1">{feedback.comment}</p>
                        </div>
                      </motion.div>
                    ))}

                  </div>
                </motion.div>

                {/* Analytics card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="glass-morphism rounded-xl p-6 hover:border-[#7C3AED] transition-all md:col-span-2"
                >
                  <h4 className="text-white text-lg mb-4" style={{ fontWeight: 600 }}>Hiring Pipeline</h4>
                  <div className="flex items-end justify-between gap-2 h-32">
                    {[
                      { label: 'Applied', value: 85, color: '#7C3AED' },
                      { label: 'Screened', value: 65, color: '#8B5CF6' },
                      { label: 'Interviewed', value: 42, color: '#A78BFA' },
                      { label: 'Offered', value: 18, color: '#C4B5FD' },
                      { label: 'Hired', value: 12, color: '#F59E0B' }
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: `${bar.value}%` }}
                          transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                          viewport={{ once: true }}
                          className="w-full rounded-t-lg"
                          style={{ backgroundColor: bar.color }}
                        />
                        <p className="text-[#A1A1AA] text-xs text-center">{bar.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Floating elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-8 -right-8 glass-morphism rounded-xl p-4 shadow-xl"
          >
            <div className="text-[#F59E0B] text-2xl" style={{ fontWeight: 600 }}>94%</div>
            <p className="text-[#A1A1AA] text-xs">Match Score</p>
          </motion.div>

          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-8 -left-8 glass-morphism rounded-xl p-4 shadow-xl"
          >
            <div className="text-[#7C3AED] text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
              AI + HUMAN
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}