import { motion } from "motion/react";
import { useState } from "react";
import { Zap, TrendingDown, Eye } from "lucide-react";

interface BetrayalCard {
  icon: React.ReactNode;
  title: string;
  text: string;
  hoverReveal: string;
}

const betrayals: BetrayalCard[] = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "The Efficiency Lie",
    text: "Faster hiring isn't better hiring",
    hoverReveal: "We tracked 5,000 hires: teams that screened faster had 42% higher turnover"
  },
  {
    icon: <TrendingDown className="w-8 h-8" />,
    title: "The Data Deception",
    text: "People aren't spreadsheets",
    hoverReveal: "78% of top performers had 'non-ideal' resumes but exceptional potential"
  },
  {
    icon: <Eye className="w-8 h-8" />,
    title: "The Context Blindspot",
    text: "Algorithms miss what matters",
    hoverReveal: "Career gaps, unconventional paths, and growth trajectories tell the real story"
  }
];

export function AwakeningSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="relative py-32 overflow-hidden" style={{ background: '#1A1A1D' }}>
      {/* Diagonal light beams */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-full w-1"
            style={{
              left: `${20 + i * 30}%`,
              background: 'linear-gradient(to bottom, transparent, #7C3AED, transparent)',
              transform: 'rotate(15deg)',
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
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
          <h2 className="text-[48px] text-white mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
            The Three Betrayals of Modern Recruitment
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {betrayals.map((betrayal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group cursor-pointer"
            >
              <motion.div
                className="glass-morphism rounded-2xl p-8 h-80 flex flex-col justify-between transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.4)',
                }}
                style={{
                  borderColor: hoveredCard === index ? '#7C3AED' : 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <div>
                  <motion.div
                    className="text-[#7C3AED] mb-6"
                    animate={{
                      rotate: hoveredCard === index ? 360 : 0,
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    {betrayal.icon}
                  </motion.div>
                  
                  <h3 className="text-[32px] text-white mb-4" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
                    {betrayal.title}
                  </h3>
                  
                  <p className="text-[20px] text-[#A1A1AA]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {betrayal.text}
                  </p>
                </div>

                {/* Hover reveal */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: hoveredCard === index ? 1 : 0,
                    height: hoveredCard === index ? 'auto' : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t border-[#7C3AED]/30 mt-4">
                    <p className="text-[16px] text-white/90 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {betrayal.hoverReveal}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-[24px] text-white max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
            There's a reason <span className="text-[#F59E0B]" style={{ fontWeight: 600 }}>7 of 10</span> AI hiring tools get abandoned.{' '}
            <span className="text-[#7C3AED]" style={{ fontWeight: 500 }}>We built the one that doesn't.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}