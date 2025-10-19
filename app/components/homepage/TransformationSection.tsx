import { motion, useInView } from "motion/react";
import { X, Check } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const oldReality = [
  "Chaotic resume piles",
  "Anxious hiring managers",
  "Guesswork and gut feelings",
  "Expensive mis-hires"
];

const newReality = [
  "Curated candidate stories",
  "Confident decision-making",
  "Data-backed intuition",
  "Thriving team additions"
];

const metrics = [
  { value: 68, label: "less screening time", suffix: "%" },
  { value: 45, label: "better 12-month retention", suffix: "%" },
  { value: 92, label: "recruiter satisfaction", suffix: "%" },
  { value: 3.2, label: "ROI within 6 months", suffix: "x" }
];

function CountUpAnimation({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number | null = null;
      const duration = 2000;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        setCount(Math.floor(progress * end * 10) / 10);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, end]);

  return (
    <div ref={ref} className="text-[48px] text-[#F59E0B]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
      {count.toFixed(suffix === "x" ? 1 : 0)}{suffix}
    </div>
  );
}

export function TransformationSection() {
  return (
    <section className="relative py-32 overflow-hidden" style={{ background: 'linear-gradient(to right, #1A1A1D 0%, #1A1A1D 50%, #0E0E12 50%, #0E0E12 100%)' }}>
      <div className="container mx-auto px-16 relative z-10">
        {/* Split screen comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-20">
          {/* Left side - The Old Reality */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-12 border-r border-[#7C3AED]/20"
          >
            <h3 className="text-[32px] text-[#A1A1AA] mb-8" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
              The Old Reality
            </h3>

            <div className="space-y-6">
              {oldReality.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                    <X className="w-5 h-5 text-red-400" />
                  </div>
                  <p className="text-[18px] text-[#A1A1AA] line-through" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Chaos visualization */}
            <motion.div
              className="mt-12 relative h-48 opacity-20"
              animate={{
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-16 h-20 bg-[#A1A1AA]/20 rounded"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    rotate: Math.random() * 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - The New Reality */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="p-12"
          >
            <h3 className="text-[32px] text-white mb-8" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
              The New Reality
            </h3>

            <div className="space-y-6">
              {newReality.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#7C3AED]/20 flex items-center justify-center group-hover:bg-[#7C3AED]/30 transition-colors">
                    <Check className="w-5 h-5 text-[#7C3AED]" />
                  </div>
                  <p className="text-[18px] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-8 glass-morphism rounded-xl hover:border-[#7C3AED] transition-colors"
            >
              <CountUpAnimation end={metric.value} suffix={metric.suffix} />
              <p className="text-[16px] text-[#A1A1AA] mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                {metric.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}