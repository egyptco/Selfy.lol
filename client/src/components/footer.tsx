import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-40"
    >
      <p className="text-foreground/50 text-xs font-medium">
        © 2025 Wahy Team. All rights reserved.
      </p>
    </motion.div>
  );
}