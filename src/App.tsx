import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Learn from "./pages/Learn";
import Upgrade from "./pages/Upgrade";
import PaymentSuccess from "./pages/PaymentSuccess";
import Progress from "./pages/Progress";
import Achievements from "./pages/Achievements";
import Quests from "./pages/Quests";
import FocusQuest from "./pages/quests/FocusQuest";
import CalmQuest from "./pages/quests/CalmQuest";
import MemoryQuest from "./pages/quests/MemoryQuest";
import SpeedQuest from "./pages/quests/SpeedQuest";
import BrainSwitchQuest from "./pages/quests/BrainSwitchQuest";
import MemoryMazeQuest from "./pages/quests/MemoryMazeQuest";
import FocusFlipQuest from "./pages/quests/FocusFlipQuest";
import PatternSprintQuest from "./pages/quests/PatternSprintQuest";
import MindMatchQuest from "./pages/quests/MindMatchQuest";
import ReactionRunQuest from "./pages/quests/ReactionRunQuest";
import Insights from "./pages/Insights";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/*"
            element={
              <SidebarProvider>
                <div className="flex min-h-screen w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b flex items-center px-4">
                      <SidebarTrigger />
                    </header>
                    <main className="flex-1">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/learn" element={<Learn />} />
                        <Route path="/upgrade" element={<Upgrade />} />
                        <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
                        <Route path="/progress" element={<Progress />} />
                        <Route path="/achievements" element={<Achievements />} />
                        <Route path="/quests" element={<Quests />} />
                        <Route path="/quest/focus" element={<FocusQuest />} />
                        <Route path="/quest/calm" element={<CalmQuest />} />
                        <Route path="/quest/memory" element={<MemoryQuest />} />
                        <Route path="/quest/speed" element={<SpeedQuest />} />
                        <Route path="/quest/switch" element={<BrainSwitchQuest />} />
                        <Route path="/quest/memory-maze" element={<MemoryMazeQuest />} />
                        <Route path="/quest/focus-flip" element={<FocusFlipQuest />} />
                        <Route path="/quest/pattern-sprint" element={<PatternSprintQuest />} />
                        <Route path="/quest/mind-match" element={<MindMatchQuest />} />
                        <Route path="/quest/reaction-run" element={<ReactionRunQuest />} />
                        <Route path="/insights" element={<Insights />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
