import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ProfilePage from "@/components/profile-page";
import WelcomeScreen from "@/components/welcome-screen";
import CustomBackground from "@/components/custom-background";
import NowPlaying from "@/components/now-playing";
import AuthButtons from "@/components/auth-buttons";
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

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    setCurrentUser(user);
  }, []);
  
  const { data: profile } = useQuery<Profile>({
    queryKey: currentUser ? [`/api/profile/${currentUser}`] : ["/api/profile"],
    enabled: hasEntered,
  });

  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${theme}`}>
      {hasEntered && profile && (
        <CustomBackground 
          backgroundType={profile.backgroundType || "particles"}
          backgroundUrl={profile.backgroundUrl}
        />
      )}
      
      {!hasEntered ? (
        <WelcomeScreen onEnter={() => setHasEntered(true)} />
      ) : (
        <>
          <ProfilePage />
        </>
      )}
      
      {/* الأزرار الثابتة للمصادقة */}
      <AuthButtons />
    </div>
  );
}
