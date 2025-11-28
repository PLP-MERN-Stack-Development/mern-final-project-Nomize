import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Target, Trophy } from "lucide-react";
import { playSound } from "@/utils/sounds";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";

const SYMBOLS = ["🔷", "⭐", "🔺", "⚡", "🌙", "☀️", "💎", "🎯"];

type Cell = {
  id: number;
  symbol: string;
  matched: boolean;
};

const FocusFlipQuest = () => {
  const navigate = useNavigate();
  const { isPremium, loading } = useSubscription();
  const [gameState, setGameState] = useState<"idle" | "playing" | "complete">("idle");
  const [grid, setGrid] = useState<Cell[]>([]);
  const [targetSymbol, setTargetSymbol] = useState("");
  const [foundCount, setFoundCount] = useState(0);
  const [totalTargets, setTotalTargets] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);

  useEffect(() => {
    if (!loading && !isPremium) {
      toast({
        title: "Premium Feature",
        description: "Focus Flip is a premium quest. Upgrade to unlock!",
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

  const startGame = () => {
    playSound("click");
    const target = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    setTargetSymbol(target);

    const targetCount = 6;
    const totalCells = 16;
    const cells: Cell[] = [];

    for (let i = 0; i < targetCount; i++) {
      cells.push({ id: i, symbol: target, matched: false });
    }

    for (let i = targetCount; i < totalCells; i++) {
      let symbol;
      do {
        symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      } while (symbol === target);
      cells.push({ id: i, symbol, matched: false });
    }

    cells.sort(() => Math.random() - 0.5);

    setGrid(cells);
    setTotalTargets(targetCount);
    setFoundCount(0);
    setScore(0);
    setTimeLeft(45);
    setGameState("playing");
  };

  const handleCellClick = (cellId: number) => {
    if (gameState !== "playing") return;

    const cell = grid.find((c) => c.id === cellId);
    if (!cell || cell.matched) return;

    if (cell.symbol === targetSymbol) {
      playSound("correct");
      setGrid((prev) =>
        prev.map((c) => (c.id === cellId ? { ...c, matched: true } : c))
      );
      const newFoundCount = foundCount + 1;
      setFoundCount(newFoundCount);
      setScore((prev) => prev + 10);

      if (newFoundCount === totalTargets) {
        playSound("questComplete");
        toast({
          title: "All Found!",
          description: "Starting next round...",
        });
        setTimeout(startGame, 1500);
      }
    } else {
      playSound("wrong");
      setScore((prev) => Math.max(0, prev - 2));
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
              <Target className="w-6 h-6 text-focus" />
              Focus Flip
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
                Found: {foundCount}/{totalTargets}
              </span>
            </div>

            {gameState === "idle" && (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Find all matching symbols as fast as you can!
                </p>
                <Button onClick={startGame} size="lg">
                  Start Quest
                </Button>
              </div>
            )}

            {gameState === "playing" && (
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground mb-2">Find all:</p>
                <div className="text-6xl">{targetSymbol}</div>
              </div>
            )}

            {(gameState === "playing" || gameState === "complete") && (
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {grid.map((cell) => (
                  <button
                    key={cell.id}
                    onClick={() => handleCellClick(cell.id)}
                    disabled={gameState !== "playing" || cell.matched}
                    className={`
                      aspect-square rounded-lg border-2 text-4xl transition-all
                      ${cell.matched ? "bg-focus/20 border-focus opacity-50" : "bg-muted/20 border-muted"}
                      ${gameState === "playing" && !cell.matched ? "hover:bg-muted/40 cursor-pointer" : "cursor-not-allowed"}
                    `}
                  >
                    {cell.symbol}
                  </button>
                ))}
              </div>
            )}

            {gameState === "complete" && (
              <div className="text-center space-y-4 p-6 bg-muted/50 rounded-lg">
                <Trophy className="w-16 h-16 mx-auto text-primary" />
                <h3 className="text-2xl font-bold">Quest Complete!</h3>
                <p className="text-xl">Final Score: {score}</p>
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

export default FocusFlipQuest;
