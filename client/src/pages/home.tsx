import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProfilePage from "@/components/profile-page";
import WelcomeScreen from "@/components/welcome-screen";
import CustomBackground from "@/components/custom-background";
import NowPlaying from "@/components/now-playing";
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
  const { theme } = useTheme();
  
  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
    enabled: hasEntered,
  });

  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${theme}`}>
      {hasEntered && (
        <CustomBackground 
          backgroundType={profile?.backgroundType || "particles"}
          backgroundUrl={profile?.backgroundUrl}
        />
      )}
      
      {!hasEntered ? (
        <WelcomeScreen onEnter={() => setHasEntered(true)} />
      ) : (
        <>
          <ProfilePage />
          {(profile?.audioTitle || profile?.audioUrl) && (
            <NowPlaying 
              audioTitle={profile.audioTitle}
              audioUrl={profile.audioUrl}
            />
          )}
        </>
      )}
    </div>
  );
}
