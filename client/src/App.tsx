import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SharedProfile from "@/pages/shared-profile";
import RegisterPage from "@/pages/register-page";
import LoginPage from "@/pages/login-page";
import UserDashboard from "@/components/user-dashboard";
import ProfilePage from "@/components/profile-page";
import PublicProfileView from "@/pages/public-profile-view";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard" component={UserDashboard} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/public/:userId" component={PublicProfileView} />
      <Route path="/share/:shareableUrl" component={SharedProfile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
