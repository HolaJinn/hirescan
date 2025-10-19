import { motion } from "motion/react";
import { Shield, Eye, Brain } from "lucide-react";

const principles = [
  {
    icon: Shield,
    title: "Human Sovereignty",
    text: "You always have final say. Override any suggestion, anytime.",
    color: "#7C3AED"
  },
  {
    icon: Eye,
    title: "Radical Transparency",
    text: "See exactly why we recommend matches. No black boxes.",
    color: "#8B5CF6"
  },
  {
    icon: Brain,
    title: "Contextual Intelligence",
    text: "We analyze data. You assess character, culture, and potential.",
    color: "#F59E0B"
  }
];

export function GuardrailsSection() {
  return (
    <section className="relative py-32 overflow-hidden" style={{ background: '#0E0E12' }}>
      {/* Floating orbs background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: `radial-gradient(circle, ${i % 2 === 0 ? '#7C3AED' : '#F59E0B'} 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.1,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-[48px] text-white" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
            Our Uncompromising Principles
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative h-full"
              >
                {/* Connection lines on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${principle.color}15 0%, transparent 70%)`,
                  }}
                />

                <div className="glass-morphism rounded-2xl p-8 h-full flex flex-col items-center text-center relative z-10 transition-all duration-300 group-hover:border-opacity-100" style={{ borderColor: principle.color, borderWidth: 1 }}>
                  {/* Icon with pulse effect */}
                  <motion.div
                    className="relative mb-6"
                    whileHover={{ scale: 1.1 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: principle.color }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                    <div 
                      className="relative w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${principle.color}20` }}
                    >
                      <principle.icon className="w-10 h-10" style={{ color: principle.color }} />
                    </div>
                  </motion.div>

                  <h3 className="text-[32px] text-white mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
                    {principle.title}
                  </h3>

                  <p className="text-[18px] text-[#A1A1AA] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {principle.text}
                  </p>

                  {/* Decorative element */}
                  <motion.div
                    className="mt-6 h-1 w-16 rounded-full"
                    style={{ backgroundColor: principle.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: 64 }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Connecting lines visualization */}
        <motion.svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <motion.path
            d="M 200 300 Q 400 200 600 300"
            stroke="#7C3AED"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            viewport={{ once: true }}
          />
          <motion.path
            d="M 600 300 Q 800 200 1000 300"
            stroke="#8B5CF6"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.7 }}
            viewport={{ once: true }}
          />
        </motion.svg>
      </div>
    </section>
  );
}