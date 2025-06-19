import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, Eye } from "lucide-react";

interface SiteStats {
  id: number;
  totalViews: number;
  uniqueVisitors: number;
  lastUpdated: Date;
}

export default function SiteStats() {
  const { data: stats } = useQuery<SiteStats>({
    queryKey: ["/api/site/stats"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (!stats) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <div className="glass-effect rounded-xl p-4 border border-border/20">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-foreground/80">
            <Eye className="w-4 h-4 text-accent" />
            <div>
              <span className="text-sm font-medium">
                {stats.totalViews.toLocaleString()}
              </span>
              <p className="text-xs text-foreground/60">إجمالي المشاهدات</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-foreground/80">
            <Users className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-sm font-medium">
                {stats.uniqueVisitors.toLocaleString()}
              </span>
              <p className="text-xs text-foreground/60">زوار فريدون</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}