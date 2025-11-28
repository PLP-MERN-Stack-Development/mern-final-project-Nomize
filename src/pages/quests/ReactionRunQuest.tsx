import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Zap, Trophy } from "lucide-react";
import { playSound } from "@/utils/sounds";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";

type Target = {
  id: number;
  x: number;
  y: number;
  size: number;
};

const ReactionRunQuest = () => {
  const navigate = useNavigate();
  const { isPremium, loading } = useSubscription();
  const [gameState, setGameState] = useState<"idle" | "playing" | "complete">("idle");
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const targetAppearTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!loading && !isPremium) {
      toast({
        title: "Premium Feature",
        description: "Reaction Run is a premium quest. Upgrade to unlock!",
        variant: "destructive",
      });
      navigate("/upgrade");
    }
  }, [isPremium, loading, navigate]);

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === "playing") {
      endGame();
    }
  }, [timeLeft, gameState]);

  useEffect(() => {
    if (gameState === "playing") {
      const interval = setInterval(() => {
        spawnTarget();
      }, 800);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const startGame = () => {
    playSound("click");
    setScore(0);
    setHits(0);
    setMisses(0);
    setTimeLeft(30);
    setTargets([]);
    setReactionTimes([]);
    setGameState("playing");
  };

  const spawnTarget = () => {
    const id = Date.now();
    const maxX = 90;
    const maxY = 80;
    const minSize = 40;
    const maxSize = 80;

    const target: Target = {
      id,
      x: Math.random() * maxX,
      y: Math.random() * maxY,
      size: Math.random() * (maxSize - minSize) + minSize,
    };

    setTargets((prev) => [...prev, target]);
    targetAppearTimeRef.current = Date.now();

    setTimeout(() => {
      setTargets((prev) => {
        const stillExists = prev.find((t) => t.id === id);
        if (stillExists) {
          setMisses((m) => m + 1);
          playSound("wrong");
        }
        return prev.filter((t) => t.id !== id);
      });
    }, 1200);
  };

  const handleTargetClick = (targetId: number) => {
    const reactionTime = Date.now() - targetAppearTimeRef.current;
    setReactionTimes((prev) => [...prev, reactionTime]);

    playSound("correct");
    setTargets((prev) => prev.filter((t) => t.id !== targetId));
    setHits((prev) => prev + 1);

    const points = reactionTime < 300 ? 20 : reactionTime < 500 ? 15 : 10;
    setScore((prev) => prev + points);

    if (reactionTime < 250) {
      toast({
        title: "Lightning Fast! ⚡",
        description: `${reactionTime}ms - Amazing!`,
      });
    }
  };

  const endGame = () => {
    playSound("questComplete");
    setGameState("complete");
  };

  const avgReactionTime =
    reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl space-y-4">
        <Button variant="outline" onClick={() => navigate("/quests")}>
          ← Back to Quests
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-speed" />
              Reaction Run
              <span className="ml-auto text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                PREMIUM
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Time: {timeLeft}s</span>
              <span>Score: {score}</span>
              <span>
                Hits: {hits} | Misses: {misses}
              </span>
            </div>

            {gameState === "idle" && (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Click targets as fast as you can! Faster clicks = more points.
                </p>
                <Button onClick={startGame} size="lg">
                  Start Quest
                </Button>
              </div>
            )}

            {gameState === "playing" && (
              <div className="relative w-full h-[500px] bg-muted/20 rounded-lg border-2 border-muted overflow-hidden">
                {targets.map((target) => (
                  <button
                    key={target.id}
                    onClick={() => handleTargetClick(target.id)}
                    className="absolute rounded-full bg-speed hover:bg-speed/80 transition-all shadow-lg animate-pulse"
                    style={{
                      left: `${target.x}%`,
                      top: `${target.y}%`,
                      width: `${target.size}px`,
                      height: `${target.size}px`,
                    }}
                  />
                ))}
              </div>
            )}

            {gameState === "complete" && (
              <div className="text-center space-y-4 p-6 bg-muted/50 rounded-lg">
                <Trophy className="w-16 h-16 mx-auto text-primary" />
                <h3 className="text-2xl font-bold">Quest Complete!</h3>
                <div className="space-y-2">
                  <p className="text-xl">Final Score: {score}</p>
                  <p className="text-muted-foreground">
                    Accuracy: {hits > 0 ? Math.round((hits / (hits + misses)) * 100) : 0}%
                  </p>
                  <p className="text-muted-foreground">
                    Average Reaction Time: {avgReactionTime}ms
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => navigate("/quests")}>
                    Back to Quests
                  </Button>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Play Again
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

export default ReactionRunQuest;
