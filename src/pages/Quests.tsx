import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, Target, Zap, MemoryStick, Shuffle, Heart, Lock, Grid3x3, Layers, Sparkles } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { useSubscription } from "@/hooks/useSubscription";
import { Badge } from "@/components/ui/badge";

const Quests = () => {
  const navigate = useNavigate();
  const { playSound } = useSound();
  const { isPremium, loading } = useSubscription();

  const quests = [
    {
      id: "focus",
      title: "Focus Quest",
      description: "Find all target shapes as fast as you can",
      icon: Target,
      color: "text-focus",
      bgColor: "bg-focus/10",
      difficulty: "Medium",
      time: "30 seconds",
      route: "/quest/focus",
      locked: false,
    },
    {
      id: "memory",
      title: "Memory Quest",
      description: "Remember and recall color sequences",
      icon: MemoryStick,
      color: "text-memory",
      bgColor: "bg-memory/10",
      difficulty: "Medium",
      time: "45 seconds",
      route: "/quest/memory",
      locked: false,
    },
    {
      id: "speed",
      title: "Speed Quest",
      description: "Click green circles, avoid others",
      icon: Zap,
      color: "text-speed",
      bgColor: "bg-speed/10",
      difficulty: "Hard",
      time: "40 seconds",
      route: "/quest/speed",
      locked: false,
    },
    {
      id: "switch",
      title: "Brain Switch",
      description: "Adapt to changing rules quickly",
      icon: Shuffle,
      color: "text-switch",
      bgColor: "bg-switch/10",
      difficulty: "Hard",
      time: "2 minutes",
      route: "/quest/switch",
      locked: false,
    },
    {
      id: "calm",
      title: "Calm Quest",
      description: "Practice mindful breathing",
      icon: Heart,
      color: "text-calm",
      bgColor: "bg-calm/10",
      difficulty: "Easy",
      time: "2 minutes",
      route: "/quest/calm",
      locked: false,
    },
    {
      id: "memory-maze",
      title: "Memory Maze",
      description: "4x4 grid path recall challenge",
      icon: Brain,
      color: "text-memory",
      bgColor: "bg-memory/10",
      difficulty: "Hard",
      time: "Progressive",
      route: "/quest/memory-maze",
      locked: !isPremium,
    },
    {
      id: "focus-flip",
      title: "Focus Flip",
      description: "Find matching symbols in grid",
      icon: Grid3x3,
      color: "text-focus",
      bgColor: "bg-focus/10",
      difficulty: "Medium",
      time: "45 seconds",
      route: "/quest/focus-flip",
      locked: !isPremium,
    },
    {
      id: "pattern-sprint",
      title: "Pattern Sprint",
      description: "Predict the next pattern",
      icon: Sparkles,
      color: "text-speed",
      bgColor: "bg-speed/10",
      difficulty: "Medium",
      time: "Progressive",
      route: "/quest/pattern-sprint",
      locked: !isPremium,
    },
    {
      id: "mind-match",
      title: "Mind Match",
      description: "Classic card matching game",
      icon: Layers,
      color: "text-memory",
      bgColor: "bg-memory/10",
      difficulty: "Easy",
      time: "Unlimited",
      route: "/quest/mind-match",
      locked: !isPremium,
    },
    {
      id: "reaction-run",
      title: "Reaction Run",
      description: "Fast target hitting challenge",
      icon: Zap,
      color: "text-speed",
      bgColor: "bg-speed/10",
      difficulty: "Hard",
      time: "30 seconds",
      route: "/quest/reaction-run",
      locked: !isPremium,
    },
  ];

  const handleQuestClick = (route: string, locked: boolean) => {
    if (locked) {
      playSound("wrong");
      navigate("/upgrade");
      return;
    }
    playSound("click");
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-focus bg-clip-text text-transparent">
            Choose Your Quest
          </h1>
          <p className="text-muted-foreground text-lg">
            Select a cognitive challenge to train your brain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.map((quest) => {
            const Icon = quest.icon;
            return (
              <Card
                key={quest.id}
                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                  quest.locked ? "opacity-60" : "hover:scale-105 cursor-pointer"
                }`}
                onClick={() => handleQuestClick(quest.route, quest.locked)}
              >
                {quest.locked && (
                  <div className="absolute top-4 right-4 z-10">
                    <Lock className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}

                <div className={`absolute top-0 right-0 w-32 h-32 ${quest.bgColor} rounded-full blur-3xl opacity-50 -mr-16 -mt-16`} />

                <CardHeader>
                  <div className={`w-16 h-16 ${quest.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 ${quest.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{quest.title}</CardTitle>
                  <CardDescription className="text-base">
                    {quest.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Difficulty:</span>
                    <span className={`font-semibold ${quest.color}`}>
                      {quest.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-semibold">{quest.time}</span>
                  </div>

                  <Button
                    className="w-full"
                    variant={quest.locked ? "outline" : "default"}
                    disabled={quest.locked}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuestClick(quest.route, quest.locked);
                    }}
                  >
                    {quest.locked ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Premium Only
                      </>
                    ) : (
                      "Start Quest"
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center p-8 bg-muted/50 rounded-lg">
          <Brain className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">
            Train Your Brain Daily
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each quest targets different cognitive abilities. Mix and match to create a complete brain training routine.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Quests;
