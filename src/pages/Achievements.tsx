import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Star, Zap, Target, Brain, Wind, Activity, Award } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  unlocked: boolean;
  requirement: number;
  current: number;
}

const Achievements = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: questResults } = await supabase
        .from("quest_results")
        .select("*")
        .eq("user_id", user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      const totalQuests = questResults?.length || 0;
      const focusQuests = questResults?.filter(q => q.quest_type === "focus").length || 0;
      const memoryQuests = questResults?.filter(q => q.quest_type === "memory").length || 0;
      const speedQuests = questResults?.filter(q => q.quest_type === "speed").length || 0;
      const switchQuests = questResults?.filter(q => q.quest_type === "switch").length || 0;
      const calmQuests = questResults?.filter(q => q.quest_type === "calm").length || 0;

      const achievementsList: Achievement[] = [
        {
          id: "first_quest",
          name: "First Steps",
          description: "Complete your first quest",
          icon: Star,
          unlocked: totalQuests >= 1,
          requirement: 1,
          current: totalQuests,
        },
        {
          id: "quest_collector",
          name: "Quest Collector",
          description: "Try all 5 quest types",
          icon: Award,
          unlocked: focusQuests > 0 && memoryQuests > 0 && speedQuests > 0 && switchQuests > 0 && calmQuests > 0,
          requirement: 5,
          current: [focusQuests > 0, memoryQuests > 0, speedQuests > 0, switchQuests > 0, calmQuests > 0].filter(Boolean).length,
        },
        {
          id: "eagle_eye",
          name: "Eagle Eye",
          description: "Complete Focus Quest with 95%+ accuracy",
          icon: Target,
          unlocked: questResults?.some(q => q.quest_type === "focus" && q.accuracy >= 95) || false,
          requirement: 95,
          current: Math.max(...(questResults?.filter(q => q.quest_type === "focus").map(q => q.accuracy) || [0])),
        },
        {
          id: "memory_master",
          name: "Memory Master",
          description: "Recall a sequence of 7+ items",
          icon: Brain,
          unlocked: questResults?.some(q => q.quest_type === "memory" && q.items_completed >= 7) || false,
          requirement: 7,
          current: Math.max(...(questResults?.filter(q => q.quest_type === "memory").map(q => q.items_completed || 0) || [0])),
        },
        {
          id: "lightning_reflexes",
          name: "Lightning Reflexes",
          description: "Complete 10 Speed Quests",
          icon: Zap,
          unlocked: speedQuests >= 10,
          requirement: 10,
          current: speedQuests,
        },
        {
          id: "mental_gymnast",
          name: "Mental Gymnast",
          description: "Get 90%+ accuracy in Brain Switch",
          icon: Activity,
          unlocked: questResults?.some(q => q.quest_type === "switch" && q.accuracy >= 90) || false,
          requirement: 90,
          current: Math.max(...(questResults?.filter(q => q.quest_type === "switch").map(q => q.accuracy) || [0])),
        },
        {
          id: "zen_master",
          name: "Zen Master",
          description: "Complete 10 Calm Quests",
          icon: Wind,
          unlocked: calmQuests >= 10,
          requirement: 10,
          current: calmQuests,
        },
        {
          id: "dedicated_learner",
          name: "Dedicated Learner",
          description: "Complete 50 total quests",
          icon: Trophy,
          unlocked: totalQuests >= 50,
          requirement: 50,
          current: totalQuests,
        },
      ];

      setAchievements(achievementsList);
    } catch (error) {
      console.error("Error loading achievements:", error);
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Achievements</h1>
          <p className="text-muted-foreground">
            {unlockedCount} of {achievements.length} achievements unlocked
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`transition-all ${
                achievement.unlocked
                  ? "shadow-soft border-primary/50"
                  : "opacity-60"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        achievement.unlocked
                          ? "bg-primary/20"
                          : "bg-muted"
                      }`}
                    >
                      <achievement.icon
                        className={`w-6 h-6 ${
                          achievement.unlocked
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{achievement.name}</CardTitle>
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="default" className="bg-primary">
                      Unlocked
                    </Badge>
                  )}
                </div>
                <CardDescription>{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {achievement.current}/{achievement.requirement}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{
                        width: `${Math.min(
                          (achievement.current / achievement.requirement) * 100,
                          100
                        )}%`,
                      }}
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

export default Achievements;
