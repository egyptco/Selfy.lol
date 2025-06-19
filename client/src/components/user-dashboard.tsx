import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User, Settings, Edit, Save, Calendar, Mail, Globe, UserCircle } from "lucide-react";
import ChangePasswordDialog from "./change-password-dialog";

interface UserAccount {
  id: number;
  userId: string;
  name: string;
  email: string;
  bio: string;
  website: string;
  avatar: string;
  joinDate: string;
  lastLogin: string;
}

export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    bio: "",
    website: "",
    avatar: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    setCurrentUser(user);
  }, []);

  const { data: userProfile, isLoading } = useQuery<UserAccount>({
    queryKey: ["/api/auth/user", currentUser],
    enabled: !!currentUser,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof editData) => {
      const response = await apiRequest("PUT", `/api/auth/user/${currentUser}`, data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user", currentUser] });
      setIsEditing(false);
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم حفظ التغييرات بنجاح"
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في التحديث",
        description: error.message || "حدث خطأ أثناء تحديث البيانات",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (userProfile && !isEditing) {
      setEditData({
        name: userProfile.name || "",
        bio: userProfile.bio || "",
        website: userProfile.website || "",
        avatar: userProfile.avatar || ""
      });
    }
  }, [userProfile, isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(editData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userProfile) {
      setEditData({
        name: userProfile.name || "",
        bio: userProfile.bio || "",
        website: userProfile.website || "",
        avatar: userProfile.avatar || ""
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 text-center">
            <UserCircle className="w-16 h-16 mx-auto mb-4 text-white/60" />
            <h2 className="text-2xl font-bold text-white mb-2">غير مسجل الدخول</h2>
            <p className="text-white/80 mb-4">يرجى تسجيل الدخول للوصول لهذه الصفحة</p>
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
            <p className="text-white">جاري تحميل البيانات...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">خطأ</h2>
            <p className="text-white/80">تعذر تحميل بيانات المستخدم</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 p-4">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-lg border-white/20">
            <TabsTrigger value="profile" className="text-white data-[state=active]:bg-white/20">
              <User className="w-4 h-4 mr-2" />
              الملف الشخصي
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-white data-[state=active]:bg-white/20">
              <Settings className="w-4 h-4 mr-2" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  الملف الشخصي
                </CardTitle>
                {!isEditing && (
                  <Button 
                    onClick={handleEdit}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-black"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    تعديل
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                    {userProfile.avatar ? (
                      <img 
                        src={userProfile.avatar} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-white/60" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">{userProfile.name}</h3>
                    <p className="text-white/60">@{userProfile.userId}</p>
                    <Badge variant="secondary" className="mt-1 bg-white/20 text-white">
                      مستخدم نشط
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-white/20" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white flex items-center mb-2">
                        <User className="w-4 h-4 mr-2" />
                        الاسم الكامل
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                          placeholder="أدخل اسمك الكامل"
                        />
                      ) : (
                        <p className="text-white/90 p-2 rounded bg-white/10">{userProfile.name}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-white flex items-center mb-2">
                        <Mail className="w-4 h-4 mr-2" />
                        البريد الإلكتروني
                      </Label>
                      <p className="text-white/90 p-2 rounded bg-white/10">{userProfile.email}</p>
                    </div>

                    <div>
                      <Label className="text-white flex items-center mb-2">
                        <Globe className="w-4 h-4 mr-2" />
                        الموقع الإلكتروني
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editData.website}
                          onChange={(e) => setEditData({...editData, website: e.target.value})}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                          placeholder="https://example.com"
                        />
                      ) : (
                        <p className="text-white/90 p-2 rounded bg-white/10">
                          {userProfile.website || "غير محدد"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-white flex items-center mb-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        تاريخ الانضمام
                      </Label>
                      <p className="text-white/90 p-2 rounded bg-white/10">
                        {new Date(userProfile.joinDate).toLocaleDateString('ar-SA')}
                      </p>
                    </div>

                    <div>
                      <Label className="text-white mb-2 block">النبذة الشخصية</Label>
                      {isEditing ? (
                        <Textarea
                          value={editData.bio}
                          onChange={(e) => setEditData({...editData, bio: e.target.value})}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/50 resize-none"
                          placeholder="اكتب نبذة مختصرة عنك..."
                          rows={4}
                        />
                      ) : (
                        <p className="text-white/90 p-2 rounded bg-white/10 min-h-[100px]">
                          {userProfile.bio || "لم يتم إضافة نبذة شخصية بعد"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2 rtl:space-x-reverse">
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
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  إعدادات الحساب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-2">معلومات الحساب</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-white/80">معرف المستخدم: {userProfile.userId}</p>
                      <p className="text-white/80">آخر تسجيل دخول: {new Date(userProfile.lastLogin).toLocaleString('ar-SA')}</p>
                      <p className="text-white/80">تاريخ الإنشاء: {new Date(userProfile.joinDate).toLocaleString('ar-SA')}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">الأمان</h4>
                    <ChangePasswordDialog userId={userProfile.userId} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}