import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Share2, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import CustomBackground from "@/components/custom-background";
import SocialIcons from "@/components/social-icons";
import AudioPlayer from "@/components/audio-player";
import Footer from "@/components/footer";
import SiteStats from "@/components/site-stats";
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
  audioTitle: string | null;
  socialIconStyle: string | null;
  socialIconColor: string | null;
  backgroundType: string | null;
  backgroundUrl: string | null;
}

export default function PublicProfileView() {
  const { userId } = useParams();
  const [, setLocation] = useLocation();
  const { theme } = useTheme();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getNameStyleClass = (style: string) => {
    switch (style) {
      case 'gradient':
        return 'name-gradient';
      case 'shadow':
        return 'name-shadow';
      case 'glow':
        return 'name-glow';
      case 'neon':
        return 'name-neon';
      case 'rainbow':
        return 'name-rainbow';
      default:
        return 'gradient-text';
    }
  };

  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: [`/api/profile/${userId}`],
    enabled: !!userId,
  });

  const handleCopyLink = async () => {
    if (!profile) return;
    
    const shareUrl = `${window.location.origin}/public/${profile.discordId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-2xl font-semibold">جاري تحميل البروفايل...</p>
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
          className="text-center space-y-4"
        >
          <h2 className="text-2xl font-bold">لم يتم العثور على البروفايل</h2>
          <p className="text-foreground/60">البروفايل المطلوب غير موجود أو تم حذفه</p>
          <motion.button
            onClick={() => setLocation("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للصفحة الرئيسية
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const socialLinks = JSON.parse(profile.socialLinks || "{}");

  return (
    <div className={`min-h-screen overflow-hidden relative theme-transition ${profile.theme || theme}`}>
      <CustomBackground 
        backgroundType={profile.backgroundType || "particles"} 
        backgroundUrl={profile.backgroundUrl} 
      />
      
      {/* Fixed Control Buttons - Only for Visitors */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        {/* Audio Controls - For everyone */}
        {profile.audioUrl && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass-effect rounded-full p-2">
              <motion.button
                onClick={() => {
                  // Toggle audio play/pause
                  const audioElement = document.querySelector('audio');
                  if (audioElement) {
                    if (audioElement.paused) {
                      audioElement.play();
                    } else {
                      audioElement.pause();
                    }
                  }
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-black border-2 border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300"
                title="تشغيل/إيقاف الموسيقى"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.747l-4.5-3.375a1 1 0 010-1.494l4.5-3.375zM14 5a1 1 0 011.414 0l1.586 1.586a3 3 0 010 4.242L15.414 12A1 1 0 0114 10.586l.586-.586a1 1 0 000-1.414L14 8.414A1 1 0 0114 7z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Share Button - For everyone */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-effect rounded-full p-2">
            <motion.button
              onClick={() => setIsShareOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-black border-2 border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300"
              title="مشاركة الملف الشخصي"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass-effect rounded-full p-2">
            <motion.button
              onClick={() => setLocation("/")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-black border-2 border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300"
              title="العودة للصفحة الرئيسية"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Share Dialog */}
      {isShareOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsShareOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-background/90 backdrop-blur-xl border border-border/20 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">مشاركة البروفايل</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-foreground/5 rounded-lg">
                <input
                  type="text"
                  value={`${window.location.origin}/public/${profile.discordId}`}
                  readOnly
                  className="flex-1 bg-transparent text-sm"
                />
                <motion.button
                  onClick={handleCopyLink}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-accent text-white rounded text-sm"
                >
                  {copied ? "تم النسخ" : "نسخ"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <AudioPlayer audioUrl={profile.audioUrl} />
      
      {/* Site Statistics */}
      <SiteStats />

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
              className="mobile-avatar w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-accent/30 glow-pulse"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={profile.avatarUrl || `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png`}
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
          <h1 
            className={`mobile-text text-4xl md:text-5xl font-bold text-center ${getNameStyleClass((profile as any).nameStyle || 'default')}`}
            style={{ 
              color: (profile as any).nameStyle === 'default' ? ((profile as any).nameColor || '#FFFFFF') : undefined,
              '--name-color': (profile as any).nameColor || '#FFFFFF'
            } as any}
          >
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
          <div className="mobile-grid">
            <SocialIcons 
              socialLinks={socialLinks}
              iconStyle={profile.socialIconStyle || "default"}
              iconColor={profile.socialIconColor || "#8B5CF6"}
            />
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mobile-grid grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mobile-responsive"
        >
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-effect rounded-xl p-4 border border-border/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-foreground/60 uppercase tracking-wide">الموقع</p>
                <p className="font-semibold">{profile.location}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-effect rounded-xl p-4 border border-border/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-foreground/60 uppercase tracking-wide">المزاج</p>
                <p className="font-semibold">{profile.mood}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass-effect rounded-xl p-4 border border-border/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-foreground/60 uppercase tracking-wide">عضو منذ</p>
                <p className="font-semibold">{profile.joinDate}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}