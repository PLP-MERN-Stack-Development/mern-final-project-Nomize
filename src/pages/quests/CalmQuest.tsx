import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { calculateLevel } from "@/utils/levelSystem";

const CalmQuest = () => {
  const navigate = useNavigate();
  const { playSound } = useSound();
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [currentRound, setCurrentRound] = useState(0);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [circleScale, setCircleScale] = useState(0.5);
  const [phaseText, setPhaseText] = useState("");
  const [countdown, setCountdown] = useState(4);
  const totalRounds = 5;

  useEffect(() => {
    if (gameState !== "playing") return;

    const breathCycle = async () => {
      // Inhale (4 seconds)
      setBreathPhase("inhale");
      setPhaseText("Breathe In");
      animateCircle(0.5, 1, 4000);
      await countdownPhase(4);

      // Hold (4 seconds)
      setBreathPhase("hold");
      setPhaseText("Hold");
      await countdownPhase(4);

      // Exhale (8 seconds)
      setBreathPhase("exhale");
      setPhaseText("Breathe Out");
      animateCircle(1, 0.5, 8000);
      await countdownPhase(8);

      // Move to next round
      if (currentRound < totalRounds - 1) {
        setCurrentRound((prev) => prev + 1);
      } else {
        finishGame();
      }
    };

    breathCycle();
  }, [gameState, currentRound]);

  const countdownPhase = async (seconds: number) => {
    for (let i = seconds; i > 0; i--) {
      setCountdown(i);
      await wait(1000);
    }
  };

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const animateCircle = (from: number, to: number, duration: number) => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);
      const scale = from + (to - from) * easeProgress;
      setCircleScale(scale);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  };

  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const startGame = () => {
    setGameState("playing");
    setCurrentRound(0);
    setCircleScale(0.5);
  };

  const finishGame = async () => {
    setGameState("finished");
    playSound("questComplete");

    const xpEarned = 100;
    const minutesCompleted = 3;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("quest_results").insert({
          user_id: user.id,
          quest_type: "calm",
          accuracy: 100,
          score: minutesCompleted * 20,
          xp_earned: xpEarned,
          items_completed: totalRounds,
        });

        const { data: profile } = await supabase
          .from("profiles")
          .select("xp_points, calm_score, current_level")
          .eq("id", user.id)
          .single();

        if (profile) {
          const newXP = profile.xp_points + xpEarned;
          const newLevel = calculateLevel(newXP);
          const leveledUp = newLevel > (profile.current_level || 1);

          if (leveledUp) {
            playSound("levelUp");
          }

          await supabase
            .from("profiles")
            .update({
              xp_points: newXP,
              current_level: newLevel,
              calm_score: Math.min(100, (profile.calm_score || 0) + 3),
            })
            .eq("id", user.id);
        }
      }
    } catch (error) {
      console.error("Error saving quest result:", error);
    }
  };

  const getBackgroundClass = () => {
    switch (breathPhase) {
      case "inhale":
        return "from-blue-400/20 to-teal-500/20";
      case "hold":
        return "from-teal-500/20 to-cyan-500/20";
      case "exhale":
        return "from-cyan-500/20 to-blue-600/20";
      default:
        return "from-blue-600/10 to-indigo-600/10";
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br transition-all duration-1000 p-4 ${gameState === "playing" ? getBackgroundClass() : "from-background to-background"}`}>
      <div className="container mx-auto max-w-4xl space-y-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="shadow-soft bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-calm text-center">Calm Quest</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {gameState === "idle" && (
              <div className="text-center space-y-6 py-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Guided Breathing</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Follow the breathing circle for 5 rounds of box breathing. Each round takes about 16 seconds.
                  </p>
                </div>
                <div className="space-y-2 p-6 bg-accent rounded-lg max-w-sm mx-auto">
                  <p className="font-medium">Breathing Pattern:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Inhale for 4 seconds</li>
                    <li>• Hold for 4 seconds</li>
                    <li>• Exhale for 8 seconds</li>
                    <li>• 5 rounds total</li>
                  </ul>
                </div>
                <Button size="lg" onClick={startGame} className="bg-calm hover:bg-calm/90">
                  Begin Breathing
                </Button>
              </div>
            )}

            {gameState === "playing" && (
              <div className="space-y-8 py-8">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Round {currentRound + 1} of {totalRounds}
                  </p>
                  <h3 className="text-5xl font-bold text-calm">{phaseText}</h3>
                  <div className="text-6xl font-bold text-calm/60 mt-2">{countdown}</div>
                  <p className="text-sm text-muted-foreground italic mt-4">
                    {breathPhase === "inhale" && "Fill your lungs slowly and deeply..."}
                    {breathPhase === "hold" && "Notice the stillness..."}
                    {breathPhase === "exhale" && "Release all tension... let it go..."}
                  </p>
                </div>

                <div className="flex items-center justify-center min-h-[400px] relative">
                  {/* Ambient particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-calm/30 rounded-full animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${2 + Math.random() * 2}s`,
                        }}
                      />
                    ))}
                  </div>
                  
                  <div
                    className="rounded-full bg-gradient-to-br from-calm/60 to-cyan-500/40 shadow-glow transition-transform duration-1000 relative"
                    style={{
                      width: "300px",
                      height: "300px",
                      transform: `scale(${circleScale})`,
                      boxShadow: `0 0 ${60 * circleScale}px rgba(52, 211, 153, ${0.4 * circleScale})`,
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-white/10" />
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  {Array.from({ length: totalRounds }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-12 rounded-full transition-colors ${
                        i <= currentRound ? "bg-calm" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {gameState === "finished" && (
              <div className="text-center space-y-6 py-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-calm">Well Done! 🌟</h3>
                  <div className="text-5xl font-bold text-primary my-4">+100 XP</div>
                </div>

                <div className="max-w-sm mx-auto space-y-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold">{totalRounds}</div>
                      <div className="text-sm text-muted-foreground">Rounds Completed</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold">3 min</div>
                      <div className="text-sm text-muted-foreground">Time Practiced</div>
                    </CardContent>
                  </Card>
                </div>

                <p className="text-muted-foreground">
                  Your mind is calmer and more focused.
                </p>

                <div className="flex gap-4 justify-center">
                  <Button onClick={startGame} className="bg-calm hover:bg-calm/90">
                    Practice Again
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

export default CalmQuest;
