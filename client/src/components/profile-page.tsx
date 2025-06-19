import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Settings, Share2, Palette, X, Save, Copy, Check, Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { apiRequest } from "@/lib/queryClient";
import ParticlesBackground from "./particles-background";
import SocialIcons from "./social-icons";
import AudioPlayer from "./audio-player";
import WelcomeScreen from "./welcome-screen";
import Footer from "./footer";
import SiteStats from "./site-stats";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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

export default function ProfilePage() {
  const { theme, switchTheme } = useTheme();
  const [showWelcome, setShowWelcome] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const [formData, setFormData] = useState({
    username: profile?.username || "",
    status: profile?.status || "",
    location: profile?.location || "",
    mood: profile?.mood || "",
    socialLinks: profile?.socialLinks || "{}",
    shareableUrl: profile?.shareableUrl || "",
    audioUrl: profile?.audioUrl || "",
    discordId: profile?.discordId || "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username,
        status: profile.status,
        location: profile.location || "",
        mood: profile.mood || "",
        socialLinks: profile.socialLinks,
        shareableUrl: profile.shareableUrl || "",
        audioUrl: profile.audioUrl || "",
        discordId: profile.discordId,
      });
    }
  }, [profile]);

  const incrementViewMutation = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("No profile found");
      return apiRequest("POST", `/api/profile/${profile.discordId}/view`);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!profile) throw new Error("No profile found");
      return apiRequest("PUT", `/api/profile/${profile.discordId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "تم الحفظ",
        description: "تم حفظ التغييرات بنجاح",
      });
      setIsSettingsOpen(false);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في حفظ التغييرات",
        variant: "destructive",
      });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!profile) throw new Error("No profile found");
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await fetch(`/api/profile/${profile.discordId}/upload-avatar`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "تم الرفع",
        description: "تم رفع صورة الملف الشخصي بنجاح",
      });
      setUploading(false);
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "فشل في رفع الصورة",
        variant: "destructive",
      });
      setUploading(false);
    },
  });

  const handleSave = () => {
    const socialLinksObj = JSON.parse(formData.socialLinks || "{}");
    updateProfileMutation.mutate({
      username: formData.username,
      status: formData.status,
      location: formData.location,
      mood: formData.mood,
      socialLinks: JSON.stringify(socialLinksObj),
      shareableUrl: formData.shareableUrl,
      audioUrl: formData.audioUrl,
      discordId: formData.discordId,
    });
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      uploadImageMutation.mutate(file);
    }
  };

  const shareUrl = profile ? `${window.location.origin}/share/${profile.shareableUrl || profile.discordId}` : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "تم النسخ",
        description: "تم نسخ الرابط بنجاح",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في نسخ الرابط",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (profile) {
      incrementViewMutation.mutate();
    }
  }, [profile?.id]);

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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl text-red-500"
        >
          Profile not found
        </motion.div>
      </div>
    );
  }

  const socialLinks = JSON.parse(profile.socialLinks || "{}");

  if (showWelcome) {
    return <WelcomeScreen onEnter={() => setShowWelcome(false)} />;
  }

  return (
    <div className={`min-h-screen overflow-hidden relative theme-transition ${theme}`}>
      <ParticlesBackground />
      
      {/* Fixed Control Buttons */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
        {/* Theme Switcher */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="glass-effect rounded-full p-2">
            <motion.button
              onClick={() => {
                console.log("Theme button clicked, switching theme");
                switchTheme();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
              title="تغيير المظهر"
            >
              <Palette className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Settings Button */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass-effect rounded-full p-2">
              <motion.button
                onClick={() => {
                  console.log("Settings button clicked");
                  setIsSettingsOpen(true);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
                title="إعدادات الملف الشخصي"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Share Button */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="glass-effect rounded-full p-2">
              <motion.button
                onClick={() => {
                  console.log("Share button clicked");
                  setIsShareOpen(true);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
                title="مشاركة الملف الشخصي"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      <AudioPlayer audioUrl={profile?.audioUrl} />
      


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
          <h1 className="mobile-text text-4xl md:text-5xl font-bold text-center gradient-text">
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
            <SocialIcons socialLinks={socialLinks} />
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
      
      {/* Footer */}
      <Footer />

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background/95 backdrop-blur-xl border border-border/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold gradient-text">إعدادات الملف الشخصي</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSettingsOpen(false)}
                  className="hover:bg-foreground/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Profile Image Upload */}
                <div className="space-y-4 p-4 border border-border/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">صورة الملف الشخصي</h3>
                      <p className="text-sm text-foreground/60">رفع صورة جديدة للملف الشخصي</p>
                    </div>
                    <Button
                      onClick={handleImageUpload}
                      disabled={uploading}
                      className="flex items-center gap-2"
                    >
                      <Upload className={`w-4 h-4 ${uploading ? 'animate-spin' : ''}`} />
                      {uploading ? "جاري الرفع..." : "رفع صورة"}
                    </Button>
                  </div>
                  
                  {/* Current Profile Image Preview */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border/20">
                      <img
                        src={profile?.avatarUrl || `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png`}
                        alt="Current Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm text-foreground/60">
                      <p>الصورة الحالية</p>
                      <p>الحد الأقصى: 5 ميجابايت</p>
                      <p>التنسيقات المدعومة: JPG, PNG, GIF, WebP</p>
                    </div>
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">اسم المستخدم</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">الحالة</Label>
                    <Input
                      id="status"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="mt-1"
                      placeholder="last seen unknown"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">الموقع</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="mt-1"
                        placeholder="Somewhere"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mood">المزاج</Label>
                      <Input
                        id="mood"
                        value={formData.mood}
                        onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                        className="mt-1"
                        placeholder="Vibing"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <Label htmlFor="socialLinks">روابط التواصل الاجتماعي (JSON)</Label>
                  <Textarea
                    id="socialLinks"
                    value={formData.socialLinks}
                    onChange={(e) => setFormData({ ...formData, socialLinks: e.target.value })}
                    className="mt-1 h-32"
                    placeholder='{"discord": "https://discord.gg/yourserver", "instagram": "https://instagram.com/yourusername"}'
                  />
                </div>

                {/* Shareable URL */}
                <div>
                  <Label htmlFor="shareableUrl">رابط مخصص للمشاركة</Label>
                  <Input
                    id="shareableUrl"
                    value={formData.shareableUrl}
                    onChange={(e) => setFormData({ ...formData, shareableUrl: e.target.value })}
                    className="mt-1"
                    placeholder="my-custom-profile"
                  />
                </div>

                {/* Audio URL */}
                <div>
                  <Label htmlFor="audioUrl">رابط الموسيقى</Label>
                  <Input
                    id="audioUrl"
                    value={formData.audioUrl}
                    onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                    className="mt-1"
                    placeholder="https://example.com/audio.mp3"
                  />
                </div>

                {/* Save Button */}
                <Button
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  className="w-full flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {updateProfileMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onClick={() => setIsShareOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background/95 backdrop-blur-xl border border-border/20 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold gradient-text">مشاركة الملف الشخصي</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsShareOpen(false)}
                  className="hover:bg-foreground/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>رابط المشاركة</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={shareUrl}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      onClick={handleCopyLink}
                      size="icon"
                      variant="outline"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-foreground/60 text-center">
                  شارك هذا الرابط مع الآخرين لرؤية ملفك الشخصي
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
