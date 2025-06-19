import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Lock, Eye, EyeOff } from "lucide-react";

interface ChangePasswordDialogProps {
  userId: string;
}

export default function ChangePasswordDialog({ userId }: ChangePasswordDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const { toast } = useToast();

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await apiRequest("PUT", `/api/auth/user/${userId}/password`, data);
      return response.json();
    },
    onSuccess: () => {
      setOpen(false);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      toast({
        title: "تم تغيير كلمة المرور",
        description: "تم تغيير كلمة المرور بنجاح"
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في تغيير كلمة المرور",
        description: error.message || "حدث خطأ أثناء تغيير كلمة المرور",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمتا المرور الجديدتان غير متطابقتين",
        variant: "destructive"
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "خطأ",
        description: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل",
        variant: "destructive"
      });
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="w-full bg-white/20 border-white/30 text-white hover:bg-white hover:text-black"
        >
          <Lock className="w-4 h-4 mr-2" />
          تغيير كلمة المرور
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-purple-600 via-blue-600 to-blue-800 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            تغيير كلمة المرور
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword" className="text-white">كلمة المرور الحالية</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                placeholder="أدخل كلمة المرور الحالية"
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="newPassword" className="text-white">كلمة المرور الجديدة</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                placeholder="أدخل كلمة المرور الجديدة"
                required
                minLength={6}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-white">تأكيد كلمة المرور الجديدة</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                required
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
            <Button 
              type="button"
              onClick={() => setOpen(false)}
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10"
            >
              إلغاء
            </Button>
            <Button 
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="bg-white text-black hover:bg-white/90"
            >
              {changePasswordMutation.isPending ? "جاري التغيير..." : "تغيير كلمة المرور"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}