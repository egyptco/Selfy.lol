import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, Globe } from "lucide-react";

export default function AuthButtons() {
  const [, setLocation] = useLocation();
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // التحقق من حالة تسجيل الدخول
    const user = localStorage.getItem("currentUser");
    setCurrentUser(user);

    // الاستماع لتغييرات localStorage
    const handleStorageChange = () => {
      const user = localStorage.getItem("currentUser");
      setCurrentUser(user);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userSession");
    setCurrentUser(null);
    window.location.reload();
  };

  if (currentUser) {
    // المستخدم مسجل الدخول - إظهار أزرار الملف الشخصي وتسجيل الخروج
    return (
      <>
        {/* زر لوحة التحكم */}
        <Button
          onClick={() => setLocation("/dashboard")}
          className="fixed bottom-36 left-6 z-50 bg-black border-2 border-white/20 text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 shadow-lg"
        >
          <User className="w-4 h-4 ml-2" />
          لوحة التحكم
        </Button>

        {/* زر تحرير البروفايل العام */}
        <Button
          onClick={() => setLocation("/profile")}
          className="fixed bottom-20 left-6 z-50 bg-purple-600 border-2 border-purple-400 text-white hover:bg-purple-700 hover:border-purple-500 transition-all duration-300 shadow-lg"
        >
          <Settings className="w-4 h-4 ml-2" />
          تحرير البروفايل
        </Button>

        {/* زر مشاهدة البروفايل العام */}
        <Button
          onClick={() => setLocation(`/public/${currentUser}`)}
          className="fixed bottom-6 left-6 z-50 bg-green-600 border-2 border-green-400 text-white hover:bg-green-700 hover:border-green-500 transition-all duration-300 shadow-lg"
        >
          <Globe className="w-4 h-4 ml-2" />
          مشاهدة البروفايل
        </Button>

        {/* زر تسجيل الخروج - أسفل اليمين */}
        <Button
          onClick={handleLogout}
          className="fixed bottom-6 right-6 z-50 bg-red-600 border-2 border-red-400 text-white hover:bg-red-700 hover:border-red-500 transition-all duration-300 shadow-lg"
        >
          <LogOut className="w-4 h-4 ml-2" />
          تسجيل الخروج
        </Button>
      </>
    );
  }

  // المستخدم غير مسجل الدخول - إظهار أزرار التسجيل والدخول
  return (
    <>
      {/* زر إنشاء بروفايل جديد - أسفل اليسار */}
      <Button
        onClick={() => setLocation("/register")}
        className="fixed bottom-6 left-6 z-50 bg-black border-2 border-white/20 text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 shadow-lg"
      >
        إنشاء بروفايل جديد
      </Button>

      {/* زر تسجيل الدخول - أسفل اليمين */}
      <Button
        onClick={() => setLocation("/login")}
        className="fixed bottom-6 right-6 z-50 bg-black border-2 border-white/20 text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 shadow-lg"
      >
        تسجيل الدخول
      </Button>
    </>
  );
}