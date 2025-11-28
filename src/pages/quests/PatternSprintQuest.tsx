import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Zap, Trophy } from "lucide-react";
import { playSound } from "@/utils/sounds";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";

type PatternType = "number" | "shape" | "color";

const PatternSprintQuest = () => {
  const navigate = useNavigate();
  const { isPremium, loading } = useSubscription();
  const [gameState, setGameState] = useState<"idle" | "playing" | "complete">("idle");
  const [pattern, setPattern] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!loading && !isPremium) {
      toast({
        title: "Premium Feature",
        description: "Pattern Sprint is a premium quest. Upgrade to unlock!",
        variant: "destructive",
      });
      navigate("/upgrade");
    }
  }, [isPremium, loading, navigate]);

  const generateNumberPattern = () => {
    const patterns = [
      { seq: [2, 4, 6, 8], next: "10", options: ["9", "10", "12", "14"] },
      { seq: [1, 3, 5, 7], next: "9", options: ["8", "9", "10", "11"] },
      { seq: [5, 10, 15, 20], next: "25", options: ["22", "25", "28", "30"] },
      { seq: [3, 6, 9, 12], next: "15", options: ["13", "14", "15", "16"] },
      { seq: [1, 2, 4, 8], next: "16", options: ["12", "14", "16", "18"] },
      { seq: [10, 9, 8, 7], next: "6", options: ["5", "6", "7", "8"] },
    ];
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  const generateShapePattern = () => {
    const patterns = [
      { seq: ["⭐", "⭐", "🔷", "⭐"], next: "⭐", options: ["⭐", "🔷", "🔺", "⚡"] },
      { seq: ["🔺", "🔷", "🔺", "🔷"], next: "🔺", options: ["⭐", "🔷", "🔺", "⚡"] },
      { seq: ["⚡", "⚡", "⚡", "🔷"], next: "⚡", options: ["⭐", "🔷", "🔺", "⚡"] },
    ];
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  const generateColorPattern = () => {
    const patterns = [
      { seq: ["🔴", "🔵", "🔴", "🔵"], next: "🔴", options: ["🔴", "🔵", "🟢", "🟡"] },
      { seq: ["🟢", "🟢", "🟡", "🟢"], next: "🟢", options: ["🔴", "🔵", "🟢", "🟡"] },
      { seq: ["🔵", "🟡", "🔵", "🟡"], next: "🔵", options: ["🔴", "🔵", "🟢", "🟡"] },
    ];
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  const startGame = () => {
    playSound("click");
    setScore(0);
    setLevel(1);
    setStreak(0);
    setGameState("playing");
    generateNewPattern();
  };

  const generateNewPattern = () => {
    const types: PatternType[] = ["number", "shape", "color"];
    const type = types[Math.floor(Math.random() * types.length)];

    let patternData;
    if (type === "number") patternData = generateNumberPattern();
    else if (type === "shape") patternData = generateShapePattern();
    else patternData = generateColorPattern();

    setPattern(patternData.seq);
    setCorrectAnswer(patternData.next);
    setOptions(patternData.options.sort(() => Math.random() - 0.5));
  };

  const handleAnswer = (answer: string) => {
    if (answer === correctAnswer) {
      playSound("correct");
      const points = 10 + streak * 2;
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      toast({
        title: "Correct! 🎯",
        description: `+${points} points! Streak: ${streak + 1}`,
      });
      setLevel((prev) => prev + 1);
      
      if (level >= 15) {
        endGame();
      } else {
        setTimeout(generateNewPattern, 800);
      }
    } else {
      playSound("wrong");
      setStreak(0);
      toast({
        title: "Incorrect",
        description: "Streak reset! Keep trying.",
        variant: "destructive",
      });
      setTimeout(generateNewPattern, 800);
    }
  };

  const endGame = () => {
    playSound("questComplete");
    setGameState("complete");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl space-y-4">
        <Button variant="outline" onClick={() => navigate("/quests")}>
          ← Back to Quests
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-speed" />
              Pattern Sprint
              <span className="ml-auto text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                PREMIUM
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between text-sm">
              <span>Level: {level}/15</span>
              <span>Score: {score}</span>
              <span>Streak: {streak} 🔥</span>
            </div>

            {gameState === "idle" && (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Predict the next item in the pattern!
                </p>
                <Button onClick={startGame} size="lg">
                  Start Quest
                </Button>
              </div>
            )}

            {gameState === "playing" && (
              <>
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">What comes next?</p>
                  <div className="flex justify-center items-center gap-4 text-4xl p-6 bg-muted/20 rounded-lg">
                    {pattern.map((item, idx) => (
                      <span key={idx}>{item}</span>
                    ))}
                    <span className="text-2xl text-muted-foreground">→ ?</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  {options.map((option, idx) => (
                    <Button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      size="lg"
                      variant="outline"
                      className="text-3xl h-24"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </>
            )}

            {gameState === "complete" && (
              <div className="text-center space-y-4 p-6 bg-muted/50 rounded-lg">
                <Trophy className="w-16 h-16 mx-auto text-primary" />
                <h3 className="text-2xl font-bold">Quest Complete!</h3>
                <p className="text-xl">Final Score: {score}</p>
                <p className="text-muted-foreground">You completed all 15 patterns!</p>
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

export default PatternSprintQuest;
