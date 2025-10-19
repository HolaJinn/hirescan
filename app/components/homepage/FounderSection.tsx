import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

const fullQuote = `I've watched brilliant people get overlooked because algorithms couldn't read between the lines.

I've seen recruiters become spreadsheet managers instead of talent connectors.

This isn't just another AI tool. It's a correction.`;

const credentials = [
  "5 years in enterprise talent",
  "Experienced Software Engineer",
  "Personally placed 1,000+ transformative hires",
  "Built this out of necessity, not opportunity"
];

export function FounderSection() {
  const [displayedText, setDisplayedText] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= fullQuote.length) {
          setDisplayedText(fullQuote.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 20);

      return () => clearInterval(interval);
    }
  }, [isInView]);

  return (
    <section 
      ref={ref}
      className="relative py-32 overflow-hidden" 
      style={{ 
        background: '#FDFDF5',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }}
    >
      <div className="container mx-auto px-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="text-[64px] text-[#0E0E12] mb-6 leading-none">"</div>
            <blockquote 
              className="text-[32px] text-[#0E0E12] leading-relaxed whitespace-pre-line mb-6"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              {displayedText}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                |
              </motion.span>
            </blockquote>
            <div className="text-[64px] text-[#0E0E12] text-right leading-none">"</div>
          </motion.div>

          {/* Signature and date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            viewport={{ once: true }}
            className="mb-12 pl-8 border-l-4 border-[#7C3AED]"
          >
            <div className="text-[32px] text-[#0E0E12] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}>
              Yacine Ben Amor
            </div>
            <div className="text-[16px] text-[#A1A1AA]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Founder & CEO · 2025
            </div>
          </motion.div>

          {/* Credibility markers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {credentials.map((credential, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 2.5 + index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 group"
              >
                <div className="w-2 h-2 rounded-full bg-[#7C3AED] mt-2 group-hover:scale-150 transition-transform" />
                <p className="text-[18px] text-[#0E0E12]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {credential}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Portrait placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 2.8 }}
            viewport={{ once: true }}
            className="mt-16 relative w-48 h-48 mx-auto rounded-full overflow-hidden"
            style={{
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div 
              className="w-full h-full"
              style={{
                background: 'linear-gradient(135deg, #0E0E12 0%, #1A1A1D 100%)',
              }}
            />
            {/* Portrait would go here */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                YBA
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}