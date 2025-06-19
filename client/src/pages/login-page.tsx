import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    userId: "",
    password: ""
  });

  const loginMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("currentUser", data.userId);
      localStorage.setItem("userSession", JSON.stringify({
        userId: data.userId,
        loginTime: new Date().toISOString()
      }));
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بعودتك!"
      });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "معرف المستخدم أو كلمة المرور غير صحيحة",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">تسجيل الدخول</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="userId" className="text-white">معرف المستخدم</Label>
            <Input
              id="userId"
              type="text"
              value={formData.userId}
              onChange={(e) => setFormData({...formData, userId: e.target.value})}
              placeholder="أدخل معرف المستخدم"
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
              placeholder="أدخل كلمة المرور"
              required
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
          </div>

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-black border-2 border-white/20 text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300"
          >
            {loginMutation.isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setLocation("/register")}
            className="text-white/80 hover:text-white underline"
          >
            ليس لديك حساب؟ أنشئ حساباً جديداً
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