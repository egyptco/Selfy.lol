import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40"
    >
      <div className="glass-effect rounded-full px-4 py-2 border border-border/20">
        <p className="text-foreground/60 text-sm font-medium">
          © 2025 Wahy Team. All rights reserved.
        </p>
      </div>
    </motion.div>
  );
}