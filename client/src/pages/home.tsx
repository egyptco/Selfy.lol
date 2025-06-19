import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import ProfilePage from "@/components/profile-page";
import WelcomeScreen from "@/components/welcome-screen";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const { user, isAuthenticated } = useAuth();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/profile"],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showWelcome) {
    return (
      <div className="relative">
        {isAuthenticated && (
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/api/logout'}
              className="bg-background/80 backdrop-blur-sm border-accent/20 hover:bg-accent/10"
            >
              Logout
            </Button>
          </div>
        )}
        <WelcomeScreen onEnter={() => setShowWelcome(false)} />
      </div>
    );
  }

  return (
    <div className="relative">
      {isAuthenticated && (
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/api/logout'}
            className="bg-background/80 backdrop-blur-sm border-accent/20 hover:bg-accent/10"
          >
            Logout
          </Button>
        </div>
      )}
      <ProfilePage profile={profile} />
    </div>
  );
}
