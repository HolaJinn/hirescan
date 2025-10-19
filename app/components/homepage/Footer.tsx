import { motion } from "motion/react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 overflow-hidden" style={{ background: '#0E0E12' }}>
      <div className="container mx-auto px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-6"
        >
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-3xl text-white"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            HireScan
          </motion.div>

          {/* Links */}
          <div className="flex items-center gap-2 text-sm text-[#A1A1AA]" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span>© {currentYear} HireScan</span>
            <span>·</span>
            <motion.a
              href="#privacy"
              whileHover={{ color: '#7C3AED' }}
              className="transition-colors"
            >
              Privacy
            </motion.a>
            <span>·</span>
            <motion.a
              href="#terms"
              whileHover={{ color: '#7C3AED' }}
              className="transition-colors"
            >
              Terms
            </motion.a>
            <span>·</span>
            <motion.a
              href="#ethics"
              whileHover={{ color: '#7C3AED' }}
              className="transition-colors"
            >
              Ethics
            </motion.a>
          </div>

          {/* Microcopy */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-xs text-[#A1A1AA]"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            Built with intention in San Francisco
          </motion.p>

          {/* Decorative line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 200 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
            className="h-px mt-4"
            style={{ background: 'linear-gradient(to right, transparent, #7C3AED, transparent)' }}
          />
        </motion.div>
      </div>
    </footer>
  );
}