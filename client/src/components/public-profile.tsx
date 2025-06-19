import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  Edit, 
  Save, 
  Calendar, 
  MapPin, 
  Heart, 
  Share2, 
  Copy,
  Settings,
  Upload,
  Globe,
  Eye
} from "lucide-react";
import SocialIcons from "./social-icons";
import CustomBackground from "./custom-background";
import AudioPlayer from "./audio-player";

interface PublicProfile {
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

export default function PublicProfile() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: "",
    status: "",
    location: "",
    mood: "",
    socialLinks: "{}",
    theme: "theme-dark",
    audioTitle: "",
    socialIconStyle: "default",
    socialIconColor: "#8B5CF6",
    backgroundType: "particles"
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    setCurrentUser(user);
  }, []);

  const { data: profile, isLoading } = useQuery<PublicProfile>({
    queryKey: [`/api/profile/${currentUser}`],
    enabled: !!currentUser,
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/profile/create", {
        discordId: currentUser,
        ...data,
        joinDate: new Date().toISOString().split('T')[0]
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profile/${currentUser}`] });
      setIsEditing(false);
      toast({
        title: "تم إنشاء البروفايل",
        description: "تم إنشاء بروفايلك العام بنجاح"
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إنشاء البروفايل",
        description: error.message || "حدث خطأ أثناء إنشاء البروفايل",
        variant: "destructive"
      });
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PUT", `/api/profile/${currentUser}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profile/${currentUser}`] });
      setIsEditing(false);
      toast({
        title: "تم تحديث البروفايل",
        description: "تم حفظ التغييرات بنجاح"
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في التحديث",
        description: error.message || "حدث خطأ أثناء تحديث البروفايل",
        variant: "destructive"
      });
    }
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await fetch(`/api/profile/${currentUser}/upload-avatar`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload avatar');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profile/${currentUser}`] });
      toast({
        title: "تم تحديث الصورة الشخصية",
        description: "تم رفع الصورة بنجاح"
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في رفع الصورة",
        description: error.message || "حدث خطأ أثناء رفع الصورة",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (profile && !isEditing) {
      setEditData({
        username: profile.username || "",
        status: profile.status || "",
        location: profile.location || "",
        mood: profile.mood || "",
        socialLinks: profile.socialLinks || "{}",
        theme: profile.theme || "theme-dark",
        audioTitle: profile.audioTitle || "",
        socialIconStyle: profile.socialIconStyle || "default",
        socialIconColor: profile.socialIconColor || "#8B5CF6",
        backgroundType: profile.backgroundType || "particles"
      });
    }
  }, [profile, isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!profile) {
      createProfileMutation.mutate(editData);
    } else {
      updateProfileMutation.mutate(editData);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditData({
        username: profile.username || "",
        status: profile.status || "",
        location: profile.location || "",
        mood: profile.mood || "",
        socialLinks: profile.socialLinks || "{}",
        theme: profile.theme || "theme-dark",
        audioTitle: profile.audioTitle || "",
        socialIconStyle: profile.socialIconStyle || "default",
        socialIconColor: profile.socialIconColor || "#8B5CF6",
        backgroundType: profile.backgroundType || "particles"
      });
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatarMutation.mutate(file);
    }
  };

  const copyShareLink = () => {
    if (profile?.shareableUrl) {
      const shareUrl = `${window.location.origin}/share/${profile.shareableUrl}`;
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "تم نسخ الرابط",
        description: "تم نسخ رابط المشاركة إلى الحافظة"
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-white/60" />
            <h2 className="text-2xl font-bold text-white mb-2">غير مسجل الدخول</h2>
            <p className="text-white/80">يرجى تسجيل الدخول لإنشاء بروفايلك العام</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">جاري تحميل البروفايل...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    // إنشاء بروفايل جديد
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center text-center">
                <User className="w-5 h-5 mr-2" />
                إنشاء بروفايل عام جديد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-white">اسم المستخدم</Label>
                <Input
                  id="username"
                  value={editData.username}
                  onChange={(e) => setEditData({...editData, username: e.target.value})}
                  placeholder="أدخل اسم المستخدم"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                />
              </div>

              <div>
                <Label htmlFor="status" className="text-white">الحالة</Label>
                <Input
                  id="status"
                  value={editData.status}
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                  placeholder="آخر ظهور منذ قليل"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-white">الموقع</Label>
                  <Input
                    id="location"
                    value={editData.location}
                    onChange={(e) => setEditData({...editData, location: e.target.value})}
                    placeholder="مكان ما"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>

                <div>
                  <Label htmlFor="mood" className="text-white">المزاج</Label>
                  <Input
                    id="mood"
                    value={editData.mood}
                    onChange={(e) => setEditData({...editData, mood: e.target.value})}
                    placeholder="مستمتع"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                <Button 
                  onClick={handleSave}
                  disabled={createProfileMutation.isPending}
                  className="bg-white text-black hover:bg-white/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createProfileMutation.isPending ? "جاري الإنشاء..." : "إنشاء البروفايل"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const socialLinks = JSON.parse(profile.socialLinks || "{}");

  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${profile.theme}`}>
      <CustomBackground 
        backgroundType={profile.backgroundType || "particles"}
        backgroundUrl={profile.backgroundUrl}
      />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  {profile.avatarUrl ? (
                    <img 
                      src={profile.avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white/60" />
                  )}
                </div>
                {profile.isOwner && (
                  <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-white/90 transition-colors">
                    <Upload className="w-3 h-3 text-black" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
                <p className="text-white/60">@{currentUser}</p>
                <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                  <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-600/30">
                    {profile.status}
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white/80">
                    <Eye className="w-3 h-3 mr-1" />
                    {profile.viewCount} مشاهدة
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 rtl:space-x-reverse">
              {profile.shareableUrl && (
                <Button
                  onClick={copyShareLink}
                  variant="outline"
                  size="sm"
                  className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-black"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              )}
              {profile.isOwner && !isEditing && (
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  size="sm"
                  className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-black"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Separator className="bg-white/20" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-white flex items-center mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    الموقع
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    />
                  ) : (
                    <p className="text-white/90">{profile.location}</p>
                  )}
                </div>

                <div>
                  <Label className="text-white flex items-center mb-2">
                    <Heart className="w-4 h-4 mr-2" />
                    المزاج
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editData.mood}
                      onChange={(e) => setEditData({...editData, mood: e.target.value})}
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    />
                  ) : (
                    <p className="text-white/90">{profile.mood}</p>
                  )}
                </div>

                <div>
                  <Label className="text-white flex items-center mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    تاريخ الانضمام
                  </Label>
                  <p className="text-white/90">{profile.joinDate}</p>
                </div>
              </div>

              <div className="space-y-4">
                {Object.keys(socialLinks).length > 0 && (
                  <div>
                    <Label className="text-white mb-2 block">الروابط الاجتماعية</Label>
                    <SocialIcons 
                      socialLinks={socialLinks}
                      iconStyle={profile.socialIconStyle || "default"}
                      iconColor={profile.socialIconColor || "#8B5CF6"}
                    />
                  </div>
                )}

                {profile.audioUrl && (
                  <div>
                    <Label className="text-white mb-2 block">الموسيقى المفضلة</Label>
                    <AudioPlayer audioUrl={profile.audioUrl} />
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4 border-t border-white/20">
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10"
                >
                  إلغاء
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  className="bg-white text-black hover:bg-white/90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfileMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}