import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export default function ThemeSwitcher() {
  const { switchTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed top-6 right-6 z-50 md:top-6 md:right-6"
    >
      <div className="glass-effect rounded-full p-2">
        <motion.button
          onClick={switchTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-accent to-purple-500 flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
        >
          <Palette className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
