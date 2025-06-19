import { motion } from "framer-motion";
import { Music, ExternalLink } from "lucide-react";

interface NowPlayingProps {
  audioTitle?: string | null;
  audioUrl?: string | null;
}

export default function NowPlaying({ audioTitle, audioUrl }: NowPlayingProps) {
  if (!audioTitle && !audioUrl) return null;

  const getSourceIcon = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return <span className="text-red-500 text-xs">YT</span>;
    }
    if (url.includes('spotify.com')) {
      return <span className="text-green-500 text-xs">SP</span>;
    }
    return <Music className="w-3 h-3" />;
  };

  const openSource = () => {
    if (audioUrl) {
      window.open(audioUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="glass-effect rounded-lg px-4 py-2 border border-border/20 max-w-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Music className="w-4 h-4 text-purple-400 animate-pulse" />
            {audioUrl && getSourceIcon(audioUrl)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground/60">الآن يتم تشغيل</p>
            <p className="text-sm font-medium text-foreground/90 truncate">
              {audioTitle || "موسيقى مخصصة"}
            </p>
          </div>
          {audioUrl && (
            <button
              onClick={openSource}
              className="text-foreground/60 hover:text-foreground/80 transition-colors"
              title="فتح المصدر"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}