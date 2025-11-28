import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Zap, Wind, LogOut, TrendingUp, Flame, Star } from "lucide-react";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";
import focusIcon from "@/assets/focus-quest-icon.png";
import calmIcon from "@/assets/calm-quest-icon.png";

interface Profile {
  name: string;
  xp_points: number;
  current_level: number;
  streak_days: number;
  focus_score: number;
  memory_score: number;
  speed_score: number;
  calm_score: number;
  subscription_tier: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getLevelTitle = (level: number) => {
    if (level <= 3) return "Novice";
    if (level <= 7) return "Explorer";
    if (level <= 12) return "Champion";
    if (level <= 16) return "Master";
    return "Legend";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Brain className="h-12 w-12 text-primary animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading your quest...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CogniQuest
            </span>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            Welcome back, {profile?.name || "Questor"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to level up your cognitive fitness?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Level</CardTitle>
              <Star className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.current_level}</div>
              <p className="text-xs text-muted-foreground">
                {getLevelTitle(profile?.current_level || 1)}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">XP Points</CardTitle>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.xp_points}</div>
              <p className="text-xs text-muted-foreground">
                {500 - ((profile?.xp_points || 0) % 500)} to next level
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Flame className="h-4 w-4 text-focus" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.streak_days}</div>
              <p className="text-xs text-muted-foreground">days in a row</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Plan</CardTitle>
              <Badge variant="secondary">{profile?.subscription_tier}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {profile?.subscription_tier === "trial" && (
                  <p className="text-muted-foreground">7-day trial active</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cognitive Scores */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Your Cognitive Scores</CardTitle>
            <CardDescription>Track your progress across different areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-focus">Focus</span>
                  <span className="text-sm font-bold">{profile?.focus_score || 0}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-focus transition-all"
                    style={{ width: `${profile?.focus_score || 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-memory">Memory</span>
                  <span className="text-sm font-bold">{profile?.memory_score || 0}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-memory transition-all"
                    style={{ width: `${profile?.memory_score || 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-speed">Speed</span>
                  <span className="text-sm font-bold">{profile?.speed_score || 0}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-speed transition-all"
                    style={{ width: `${profile?.speed_score || 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-calm">Calm</span>
                  <span className="text-sm font-bold">{profile?.calm_score || 0}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-calm transition-all"
                    style={{ width: `${profile?.calm_score || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Quests */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Choose Your Quest</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card 
              className="shadow-card hover:shadow-glow transition-all cursor-pointer hover:-translate-y-1 border-l-4 border-l-focus"
              onClick={() => navigate("/quest/focus")}
            >
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-focus/20 flex items-center justify-center mb-4">
                  <img src={focusIcon} alt="Focus" className="w-12 h-12" />
                </div>
                <CardTitle className="text-focus">Focus Quest</CardTitle>
                <CardDescription>
                  Train attention & concentration
                </CardDescription>
                <div className="text-xs text-muted-foreground mt-2">⏱️ 2-3 min</div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-focus hover:bg-focus/90 text-focus-foreground">
                  Start Quest
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="shadow-card hover:shadow-glow transition-all cursor-pointer hover:-translate-y-1 border-l-4 border-l-memory"
              onClick={() => navigate("/quest/memory")}
            >
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-memory/20 flex items-center justify-center mb-4">
                  <Brain className="w-8 h-8 text-memory" />
                </div>
                <CardTitle className="text-memory">Memory Quest</CardTitle>
                <CardDescription>
                  Pattern recall & working memory
                </CardDescription>
                <div className="text-xs text-muted-foreground mt-2">⏱️ 2-3 min</div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-memory hover:bg-memory/90 text-memory-foreground">
                  Start Quest
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="shadow-card hover:shadow-glow transition-all cursor-pointer hover:-translate-y-1 border-l-4 border-l-speed"
              onClick={() => navigate("/quest/speed")}
            >
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-speed/20 flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-speed" />
                </div>
                <CardTitle className="text-speed">Speed Quest</CardTitle>
                <CardDescription>
                  Reaction time challenge
                </CardDescription>
                <div className="text-xs text-muted-foreground mt-2">⏱️ 2 min</div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-speed hover:bg-speed/90 text-speed-foreground">
                  Start Quest
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="shadow-card hover:shadow-glow transition-all cursor-pointer hover:-translate-y-1 border-l-4 border-l-switch"
              onClick={() => navigate("/quest/switch")}
            >
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-switch/20 flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-switch" />
                </div>
                <CardTitle className="text-switch">Brain Switch</CardTitle>
                <CardDescription>
                  Cognitive flexibility training
                </CardDescription>
                <div className="text-xs text-muted-foreground mt-2">⏱️ 3 min</div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-switch hover:bg-switch/90 text-switch-foreground">
                  Start Quest
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="shadow-card hover:shadow-glow transition-all cursor-pointer hover:-translate-y-1 border-l-4 border-l-calm"
              onClick={() => navigate("/quest/calm")}
            >
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-calm/20 flex items-center justify-center mb-4">
                  <img src={calmIcon} alt="Calm" className="w-12 h-12" />
                </div>
                <CardTitle className="text-calm">Calm Quest</CardTitle>
                <CardDescription>
                  Mindfulness breathing exercise
                </CardDescription>
                <div className="text-xs text-muted-foreground mt-2">⏱️ 3-5 min</div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-calm hover:bg-calm/90 text-calm-foreground">
                  Start Quest
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
