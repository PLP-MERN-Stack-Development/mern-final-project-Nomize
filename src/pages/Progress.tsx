import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Target, Zap, Wind, Activity } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Progress = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalQuests: 0,
    focusScore: 0,
    memoryScore: 0,
    speedScore: 0,
    calmScore: 0,
    switchScore: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("focus_score, memory_score, speed_score, calm_score")
        .eq("id", user.id)
        .single();

      const { data: questResults } = await supabase
        .from("quest_results")
        .select("*")
        .eq("user_id", user.id);

      const switchScore = questResults
        ?.filter(q => q.quest_type === "switch")
        .reduce((acc, q) => acc + q.accuracy, 0) / 
        (questResults?.filter(q => q.quest_type === "switch").length || 1);

      setStats({
        totalQuests: questResults?.length || 0,
        focusScore: profile?.focus_score || 0,
        memoryScore: profile?.memory_score || 0,
        speedScore: profile?.speed_score || 0,
        calmScore: profile?.calm_score || 0,
        switchScore: Math.floor(switchScore) || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const questTypes = [
    { name: "Focus", score: stats.focusScore, icon: Target, color: "text-focus", bg: "bg-focus/20" },
    { name: "Memory", score: stats.memoryScore, icon: Brain, color: "text-memory", bg: "bg-memory/20" },
    { name: "Speed", score: stats.speedScore, icon: Zap, color: "text-speed", bg: "bg-speed/20" },
    { name: "Brain Switch", score: stats.switchScore, icon: Activity, color: "text-switch", bg: "bg-switch/20" },
    { name: "Calm", score: stats.calmScore, icon: Wind, color: "text-calm", bg: "bg-calm/20" },
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Your Progress</h1>
          <p className="text-muted-foreground">Track your cognitive improvement over time</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overall Stats</CardTitle>
            <CardDescription>Your cognitive training summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{stats.totalQuests}</div>
            <p className="text-sm text-muted-foreground">Total Quests Completed</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questTypes.map((quest) => (
            <Card key={quest.name} className="hover:shadow-soft transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${quest.bg} flex items-center justify-center`}>
                    <quest.icon className={`w-6 h-6 ${quest.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{quest.name}</CardTitle>
                    <CardDescription>Score</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-end gap-2">
                    <div className="text-3xl font-bold">{quest.score}</div>
                    <div className="text-sm text-muted-foreground mb-1">/100</div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${quest.bg.replace('/20', '')}`}
                      style={{ width: `${quest.score}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;
