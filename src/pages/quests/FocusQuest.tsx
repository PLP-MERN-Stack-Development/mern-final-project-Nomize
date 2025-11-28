import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { calculateLevel } from "@/utils/levelSystem";
import { useSound } from "@/hooks/useSound";

type Shape = "circle" | "triangle" | "square";
type Color = "blue" | "red" | "green" | "yellow";

interface GridItem {
  id: number;
  shape: Shape;
  color: Color;
  isTarget: boolean;
}

const FocusQuest = () => {
  const navigate = useNavigate();
  const { playSound } = useSound();
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [grid, setGrid] = useState<GridItem[]>([]);
  const [targetShape, setTargetShape] = useState<Shape>("triangle");
  const [targetColor, setTargetColor] = useState<Color>("blue");
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [errors, setErrors] = useState(0);

  const shapes: Shape[] = ["circle", "triangle", "square"];
  const colors: Color[] = ["blue", "red", "green", "yellow"];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      finishGame();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const generateGrid = () => {
    const items: GridItem[] = [];
    const gridSize = 64;
    const targetCount = 15;

    for (let i = 0; i < targetCount; i++) {
      items.push({
        id: i,
        shape: targetShape,
        color: targetColor,
        isTarget: true,
      });
    }

    for (let i = targetCount; i < gridSize; i++) {
      let shape: Shape, color: Color;
      do {
        shape = shapes[Math.floor(Math.random() * shapes.length)];
        color = colors[Math.floor(Math.random() * colors.length)];
      } while (shape === targetShape && color === targetColor);

      items.push({
        id: i,
        shape,
        color,
        isTarget: false,
      });
    }

    return items.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(30);
    setScore(0);
    setCorrectClicks(0);
    setErrors(0);
    setGrid(generateGrid());
  };

  const handleClick = (item: GridItem) => {
    if (gameState !== "playing") return;

    if (item.isTarget) {
      playSound('correct');
      setCorrectClicks((prev) => prev + 1);
      setScore((prev) => prev + 10);
      const newGrid = grid.filter((i) => i.id !== item.id);
      setGrid(newGrid);
      
      // Check if all targets found
      const targetsLeft = newGrid.filter(i => i.isTarget).length;
      if (targetsLeft === 0) {
        finishGame();
      }
    } else {
      playSound('wrong');
      setErrors((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev - 5));
      toast.error("Oops! That's not the target.");
    }
  };

  const finishGame = async () => {
    setGameState("finished");
    playSound('questComplete');
    
    const timeBonus = timeLeft > 0 ? Math.floor(timeLeft * 2) : 0;
    const accuracy = correctClicks / (correctClicks + errors) * 100 || 0;
    const xpEarned = Math.floor((score + timeBonus) * 1.5);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("quest_results").insert({
          user_id: user.id,
          quest_type: "focus",
          accuracy: accuracy,
          score: score + timeBonus,
          xp_earned: xpEarned,
          items_completed: correctClicks,
          errors: errors,
        });

        const { data: profile } = await supabase
          .from("profiles")
          .select("xp_points, focus_score, current_level")
          .eq("id", user.id)
          .single();

        if (profile) {
          const newXP = profile.xp_points + xpEarned;
          const newLevel = calculateLevel(newXP);
          const leveledUp = newLevel > profile.current_level;

          await supabase
            .from("profiles")
            .update({
              xp_points: newXP,
              current_level: newLevel,
              focus_score: Math.min(100, (profile.focus_score || 0) + 2),
            })
            .eq("id", user.id);

          if (leveledUp) {
            playSound('levelUp');
            toast.success(`Level Up! You're now Level ${newLevel}!`);
          }
        }
      }
    } catch (error) {
      console.error("Error saving quest result:", error);
    }
  };

  const getShapeComponent = (shape: Shape, color: Color) => {
    const colorMap = {
      blue: "bg-primary",
      red: "bg-focus",
      green: "bg-secondary",
      yellow: "bg-speed",
    };

    const baseClasses = `${colorMap[color]} transition-transform hover:scale-110`;

    if (shape === "circle") {
      return <div className={`w-12 h-12 rounded-full ${baseClasses}`} />;
    }
    if (shape === "square") {
      return <div className={`w-12 h-12 ${baseClasses}`} />;
    }
    return (
      <div className={`w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[42px] ${baseClasses}`} />
    );
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-focus">Focus Quest</CardTitle>
              {gameState === "playing" && (
                <div className="text-2xl font-bold">{timeLeft}s</div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {gameState === "idle" && (
              <div className="text-center space-y-6 py-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Train Your Focus</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Find and click all <span className="font-bold text-primary">blue triangles</span> in the grid below. You have 30 seconds!
                  </p>
                </div>
                <div className="flex items-center justify-center gap-4 p-6 bg-accent rounded-lg">
                  <span className="text-lg">Target:</span>
                  <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[52px] bg-transparent border-b-primary" />
                  <span className="text-lg font-bold text-primary">Blue Triangle</span>
                </div>
                <Button size="lg" onClick={startGame} className="bg-focus hover:bg-focus/90">
                  Start Quest
                </Button>
              </div>
            )}

            {gameState === "playing" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <div>Score: <span className="font-bold text-focus">{score}</span></div>
                  <div className="text-2xl font-bold">
                    Targets: <span className="text-focus">{correctClicks}/15</span>
                  </div>
                  <div>Errors: <span className="font-bold text-destructive">{errors}</span></div>
                </div>
                
                <div className="grid grid-cols-8 gap-3 p-6 bg-muted rounded-lg">
                  {grid.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleClick(item)}
                      className="flex items-center justify-center p-2 hover:bg-background/50 rounded-lg transition-colors"
                    >
                      {getShapeComponent(item.shape, item.color)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {gameState === "finished" && (
              <div className="text-center space-y-6 py-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-focus">Quest Complete! 🎉</h3>
                  <div className="text-5xl font-bold text-primary my-4">
                    +{Math.floor(score * 1.5)} XP
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold">{score}</div>
                      <div className="text-sm text-muted-foreground">Score</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold">{correctClicks}</div>
                      <div className="text-sm text-muted-foreground">Correct</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold">
                        {((correctClicks / (correctClicks + errors)) * 100 || 0).toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Accuracy</div>
                    </CardContent>
                  </Card>
                </div>

                <p className="text-muted-foreground">Your focus is sharpening!</p>

                <div className="flex gap-4 justify-center">
                  <Button onClick={startGame} className="bg-focus hover:bg-focus/90">
                    Play Again
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/dashboard")}>
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FocusQuest;
