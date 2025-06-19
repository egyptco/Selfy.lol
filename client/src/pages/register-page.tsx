import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: ""
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("currentUser", data.userId);
      localStorage.setItem("userSession", JSON.stringify({
        userId: data.userId,
        loginTime: new Date().toISOString()
      }));
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "مرحباً بك في الموقع!"
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في التسجيل",
        description: error.message || "حدث خطأ أثناء إنشاء الحساب",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمتا المرور غير متطابقتين",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }

    registerMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">إنشاء حساب جديد</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="userId" className="text-white">معرف المستخدم</Label>
            <Input
              id="userId"
              type="text"
              value={formData.userId}
              onChange={(e) => setFormData({...formData, userId: e.target.value})}
              placeholder="أدخل معرف فريد"
              required
              minLength={3}
              maxLength={20}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
          </div>

          <div>
            <Label htmlFor="name" className="text-white">الاسم الكامل</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="أدخل اسمك الكامل"
              required
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-white">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="أدخل بريدك الإلكتروني"
              required
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="أدخل كلمة مرور قوية"
              required
              minLength={6}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-white">تأكيد كلمة المرور</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="أعد إدخال كلمة المرور"
              required
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
          </div>

          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-black border-2 border-white/20 text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300"
          >
            {registerMutation.isPending ? "جاري الإنشاء..." : "إنشاء الحساب"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setLocation("/login")}
            className="text-white/80 hover:text-white underline"
          >
            لديك حساب بالفعل؟ سجل الدخول
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setLocation("/")}
            className="text-white/60 hover:text-white/80 text-sm"
          >
            ← العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}