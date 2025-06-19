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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="glass-effect rounded-xl p-3 border border-border/20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-foreground/80">
            <Eye className="w-4 h-4 text-accent" />
            <div className="text-center">
              <span className="text-sm font-medium block">
                {stats.totalViews.toLocaleString()}
              </span>
              <p className="text-xs text-foreground/60">مشاهدات</p>
            </div>
          </div>
          
          <div className="w-px h-8 bg-border/30"></div>
          
          <div className="flex items-center gap-2 text-foreground/80">
            <Users className="w-4 h-4 text-purple-400" />
            <div className="text-center">
              <span className="text-sm font-medium block">
                {stats.uniqueVisitors.toLocaleString()}
              </span>
              <p className="text-xs text-foreground/60">زوار</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}