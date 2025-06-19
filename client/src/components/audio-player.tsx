import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music, Volume1, VolumeOff } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  audioUrl?: string | null;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(30);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume / 100;
    audio.muted = isMuted;

    const handleEnded = () => setIsPlaying(false);
    const handleLoadError = () => {
      console.error("Audio failed to load:", audioUrl);
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleLoadError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleLoadError);
    };
  }, [isMuted, volume, audioUrl]);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
        setIsMuted(false);
      }
    } catch (error) {
      console.error("Audio play failed:", error);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audio.muted = newMuted;
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume / 100;
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeOff className="w-4 h-4" />;
    if (volume < 30) return <Volume1 className="w-4 h-4" />;
    return <Volume2 className="w-4 h-4" />;
  };

  // Don't render if no audio URL is provided
  if (!audioUrl) {
    return null;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="fixed top-6 left-6 z-50"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div className="glass-effect rounded-full p-2">
          <motion.button
            onClick={() => setShowControls(!showControls)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
            title="عناصر التحكم في الصوت"
          >
            {!audioUrl ? (
              <Music className="w-5 h-5 opacity-50" />
            ) : isMuted || !isPlaying ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Audio Controls Panel */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 left-0 bg-white/10 backdrop-blur-md rounded-lg p-4 min-w-[200px] border border-white/20"
            >
              <div className="flex flex-col gap-3">
                {/* Play/Pause Button */}
                <motion.button
                  onClick={toggleAudio}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
                >
                  <Music className="w-4 h-4" />
                  <span className="text-sm">{isPlaying ? "إيقاف" : "تشغيل"}</span>
                </motion.button>

                {/* Mute/Unmute Button */}
                <motion.button
                  onClick={toggleMute}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
                >
                  {getVolumeIcon()}
                  <span className="text-sm">{isMuted ? "إلغاء الكتم" : "كتم الصوت"}</span>
                </motion.button>

                {/* Volume Slider */}
                <div className="flex items-center gap-2 px-3 py-2">
                  <Volume1 className="w-4 h-4 text-white/70" />
                  <Slider
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-white/70 min-w-[30px]">{volume}%</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          loop
          preload="none"
          src={audioUrl}
        />
      )}
    </>
  );
}
