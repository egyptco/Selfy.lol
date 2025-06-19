import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Save, RefreshCw, Share2, Copy, Check, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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
  nameStyle?: string | null;
  nameColor?: string | null;
}

interface SettingsPanelProps {
  profile: Profile;
  isOwner: boolean;
}

export default function SettingsPanel({ profile, isOwner }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    username: profile.username,
    status: profile.status,
    location: profile.location || "",
    mood: profile.mood || "",
    socialLinks: profile.socialLinks,
    shareableUrl: profile.shareableUrl || "",
    audioUrl: profile.audioUrl || "",
    discordId: profile.discordId,
    nameStyle: (profile as any).nameStyle || "default",
    nameColor: (profile as any).nameColor || "#FFFFFF",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        return '';
    }
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      return apiRequest("PUT", `/api/profile/${profile.discordId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "تم الحفظ",
        description: "تم حفظ التغييرات بنجاح",
      });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل في حفظ التغييرات",
        variant: "destructive",
      });
    },
  });

  const syncDiscordMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/profile/${profile.discordId}/sync`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث البيانات من Discord بنجاح",
      });
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل في تحديث البيانات من Discord",
        variant: "destructive",
      });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
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
    onError: (error) => {
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
      nameStyle: formData.nameStyle,
      nameColor: formData.nameColor,
    });
  };

  const handleSyncDiscord = () => {
    syncDiscordMutation.mutate();
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

  const shareUrl = `${window.location.origin}/share/${profile.shareableUrl || profile.discordId}`;

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

  if (!isOwner) {
    return (
      <>
        {/* Share Button Only for Non-owners */}
        <div className="fixed top-6 right-6 z-50">
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
                className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
                title="مشاركة الملف الشخصي"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Share Panel */}
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
      </>
    );
  }

  return (
    <>
      {/* Control Buttons Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-row-reverse gap-3">
        {/* Settings Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-effect rounded-full p-2">
            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
              title="إعدادات الملف الشخصي"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Share Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass-effect rounded-full p-2">
            <motion.button
              onClick={() => setIsShareOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
              title="مشاركة الملف الشخصي"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
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
                  onClick={() => setIsOpen(false)}
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
                        src={profile.avatarUrl || `https://cdn.discordapp.com/embed/avatars/${Math.floor(Math.random() * 5)}.png`}
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

                {/* Discord Settings */}
                <div className="space-y-4 p-4 border border-border/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">إعدادات Discord</h3>
                      <p className="text-sm text-foreground/60">ربط الحساب وتحديث البيانات</p>
                    </div>
                    <Button
                      onClick={handleSyncDiscord}
                      disabled={syncDiscordMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`w-4 h-4 ${syncDiscordMutation.isPending ? 'animate-spin' : ''}`} />
                      تحديث
                    </Button>
                  </div>
                  
                  <div>
                    <Label htmlFor="discordId">Discord User ID</Label>
                    <Input
                      id="discordId"
                      value={formData.discordId}
                      onChange={(e) => setFormData({ ...formData, discordId: e.target.value })}
                      className="mt-1"
                      placeholder="123456789012345678"
                    />
                    <p className="text-xs text-foreground/50 mt-1">
                      لتغيير الحساب، أدخل Discord User ID الجديد
                    </p>
                  </div>
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

                {/* Name Customization */}
                <div className="space-y-4 p-4 border border-border/20 rounded-xl">
                  <h3 className="font-semibold">تخصيص الاسم</h3>
                  
                  <div>
                    <Label htmlFor="nameStyle">نمط الاسم</Label>
                    <select
                      id="nameStyle"
                      value={formData.nameStyle}
                      onChange={(e) => setFormData({ ...formData, nameStyle: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-md"
                    >
                      <option value="default">عادي</option>
                      <option value="gradient">متدرج الألوان</option>
                      <option value="shadow">مع ظل</option>
                      <option value="glow">متوهج</option>
                      <option value="neon">نيون</option>
                      <option value="rainbow">قوس قزح</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="nameColor">لون الاسم</Label>
                    <div className="flex items-center gap-3 mt-1">
                      <input
                        type="color"
                        id="nameColor"
                        value={formData.nameColor}
                        onChange={(e) => setFormData({ ...formData, nameColor: e.target.value })}
                        className="w-12 h-10 rounded border border-border cursor-pointer"
                      />
                      <Input
                        value={formData.nameColor}
                        onChange={(e) => setFormData({ ...formData, nameColor: e.target.value })}
                        className="flex-1"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="p-3 bg-foreground/5 rounded-lg">
                    <Label className="text-sm">معاينة الاسم:</Label>
                    <div className="mt-2">
                      <span 
                        className={`text-2xl font-bold ${getNameStyleClass(formData.nameStyle)}`}
                        style={{ 
                          color: formData.nameStyle === 'default' ? formData.nameColor : undefined,
                          '--name-color': formData.nameColor 
                        } as any}
                      >
                        {formData.username}
                      </span>
                    </div>
                  </div>
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

      {/* Share Panel */}
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
    </>
  );
}