import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export default function ThemeSwitcher() {
  const { switchTheme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="fixed top-20 right-6 z-50"
    >
      <div className="glass-effect rounded-full p-2">
        <motion.button
          onClick={switchTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
          title="تغيير المظهر"
        >
          <Palette className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
