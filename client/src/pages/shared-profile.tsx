import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Eye, ArrowLeft } from "lucide-react";
import { useParams, Link } from "wouter";
import ParticlesBackground from "@/components/particles-background";
import SocialIcons from "@/components/social-icons";
import ThemeSwitcher from "@/components/theme-switcher";
import AudioPlayer from "@/components/audio-player";
import SettingsPanel from "@/components/settings-panel";
import { useTheme } from "@/hooks/use-theme";

interface Profile {
  id: number;
  discordId: string;
  username: string;
  status: string;
  joinDate: string;
  location: string;
  mood: string;
  avatarUrl: string | null;
  discordUsername: string | null;
  socialLinks: string;
  viewCount: number;
  isOwner: boolean;
  shareableUrl: string | null;
  theme: string;
  audioUrl: string | null;
}

export default function SharedProfile() {
  const { shareableUrl } = useParams();
  const { theme } = useTheme();
  
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profile/share", shareableUrl],
    queryFn: async () => {
      const response = await fetch(`/api/profile/share/${shareableUrl}`);
      if (!response.ok) {
        throw new Error('Profile not found');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-2xl font-semibold"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl text-red-500 mb-4"
        >
          Profile not found
        </motion.div>
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </motion.button>
        </Link>
      </div>
    );
  }

  const socialLinks = JSON.parse(profile.socialLinks || "{}");

  return (
    <div className={`min-h-screen overflow-hidden relative theme-transition ${theme}`}>
      <ParticlesBackground />
      
      {/* Controls */}
      <ThemeSwitcher />
      <AudioPlayer audioUrl={profile?.audioUrl} />
      <SettingsPanel profile={profile} isOwner={false} />
      
      {/* View Counter */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="glass-effect rounded-xl px-4 py-2">
          <div className="flex items-center gap-2 text-foreground/80">
            <Eye className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">
              {profile.viewCount.toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        
        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-accent/30 glow-pulse"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={profile.avatarUrl || "/api/placeholder/400/400"}
                alt="Profile Picture"
                className="w-full h-full object-cover"
              />
            </motion.div>
            {/* Status Indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-background animate-pulse"
            />
          </div>
        </motion.div>

        {/* Username */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center gradient-text">
            {profile.username}
          </h1>
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-foreground/60 text-lg font-medium">
            {profile.status}
          </p>
        </motion.div>

        {/* Social Media Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12"
        >
          <SocialIcons socialLinks={socialLinks} />
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl"
        >
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-effect rounded-xl p-4 border border-border/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-accent">📅</span>
              </div>
              <div>
                <p className="text-foreground/60 text-sm">Joined</p>
                <p className="text-foreground font-medium">{profile.joinDate}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-effect rounded-xl p-4 border border-border/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <span className="text-purple-400">📍</span>
              </div>
              <div>
                <p className="text-foreground/60 text-sm">Location</p>
                <p className="text-foreground font-medium">{profile.location}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-effect rounded-xl p-4 border border-border/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-red-400">❤️</span>
              </div>
              <div>
                <p className="text-foreground/60 text-sm">Mood</p>
                <p className="text-foreground font-medium">{profile.mood}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}