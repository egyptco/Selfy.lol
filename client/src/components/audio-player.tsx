import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Music } from "lucide-react";

interface AudioPlayerProps {
  audioUrl?: string | null;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.3;
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
  }, [isMuted, audioUrl]);

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
      >
        <div className="glass-effect rounded-full p-2">
          <motion.button
            onClick={toggleAudio}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
            title={audioUrl ? "تشغيل/إيقاف الموسيقى" : "لا توجد موسيقى"}
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
