import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, Trophy } from "lucide-react";
import { playSound } from "@/utils/sounds";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";

type Cell = {
  id: number;
  highlighted: boolean;
  userClicked: boolean;
};

const MemoryMazeQuest = () => {
  const navigate = useNavigate();
  const { isPremium, loading } = useSubscription();
  const [gameState, setGameState] = useState<"idle" | "showing" | "playing" | "complete">("idle");
  const [grid, setGrid] = useState<Cell[]>([]);
  const [path, setPath] = useState<number[]>([]);
  const [userPath, setUserPath] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [pathLength, setPathLength] = useState(3);

  useEffect(() => {
    if (!loading && !isPremium) {
      toast({
        title: "Premium Feature",
        description: "Memory Maze is a premium quest. Upgrade to unlock!",
        variant: "destructive",
      });
      navigate("/upgrade");
    }
  }, [isPremium, loading, navigate]);

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const cells: Cell[] = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      highlighted: false,
      userClicked: false,
    }));
    setGrid(cells);
  };

  const startGame = () => {
    playSound("click");
    const newPath = generateRandomPath(pathLength);
    setPath(newPath);
    setUserPath([]);
    setGameState("showing");
    showPath(newPath);
  };

  const generateRandomPath = (length: number): number[] => {
    const path: number[] = [];
    for (let i = 0; i < length; i++) {
      let cell;
      do {
        cell = Math.floor(Math.random() * 16);
      } while (path.includes(cell));
      path.push(cell);
    }
    return path;
  };

  const showPath = async (pathToShow: number[]) => {
    for (let i = 0; i < pathToShow.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      highlightCell(pathToShow[i]);
      playSound("correct");
      await new Promise((resolve) => setTimeout(resolve, 600));
      unhighlightCell(pathToShow[i]);
    }
    setGameState("playing");
  };

  const highlightCell = (cellId: number) => {
    setGrid((prev) =>
      prev.map((cell) =>
        cell.id === cellId ? { ...cell, highlighted: true } : cell
      )
    );
  };

  const unhighlightCell = (cellId: number) => {
    setGrid((prev) =>
      prev.map((cell) =>
        cell.id === cellId ? { ...cell, highlighted: false } : cell
      )
    );
  };

  const handleCellClick = (cellId: number) => {
    if (gameState !== "playing") return;

    const newUserPath = [...userPath, cellId];
    setUserPath(newUserPath);

    setGrid((prev) =>
      prev.map((cell) =>
        cell.id === cellId ? { ...cell, userClicked: true } : cell
      )
    );

    if (path[newUserPath.length - 1] !== cellId) {
      playSound("wrong");
      toast({
        title: "Incorrect!",
        description: "Wrong path. Try again!",
        variant: "destructive",
      });
      setTimeout(() => resetRound(), 1500);
      return;
    }

    playSound("correct");

    if (newUserPath.length === path.length) {
      const points = pathLength * 10;
      setScore((prev) => prev + points);
      playSound("questComplete");
      toast({
        title: "Level Complete!",
        description: `+${points} points! Moving to next level.`,
      });
      
      setTimeout(() => {
        setLevel((prev) => prev + 1);
        setPathLength((prev) => Math.min(prev + 1, 8));
        initializeGrid();
        startGame();
      }, 1500);
    }
  };

  const resetRound = () => {
    initializeGrid();
    setGameState("idle");
    setUserPath([]);
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
              <Brain className="w-6 h-6 text-memory" />
              Memory Maze
              <span className="ml-auto text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                PREMIUM
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Level: {level}</span>
              <span>Score: {score}</span>
              <span>Path Length: {pathLength}</span>
            </div>

            {gameState === "idle" && (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Watch the path light up, then repeat it!
                </p>
                <Button onClick={startGame} size="lg">
                  Start Level {level}
                </Button>
              </div>
            )}

            {gameState === "showing" && (
              <div className="text-center">
                <p className="text-lg font-semibold text-primary">
                  Watch the path...
                </p>
              </div>
            )}

            {gameState === "playing" && (
              <div className="text-center">
                <p className="text-lg font-semibold text-focus">
                  Your turn! Tap the path ({userPath.length}/{path.length})
                </p>
              </div>
            )}

            <div className="grid grid-cols-4 gap-3 aspect-square max-w-md mx-auto">
              {grid.map((cell) => (
                <button
                  key={cell.id}
                  onClick={() => handleCellClick(cell.id)}
                  disabled={gameState !== "playing"}
                  className={`
                    aspect-square rounded-lg border-2 transition-all
                    ${cell.highlighted ? "bg-memory border-memory scale-95" : "bg-muted/20 border-muted"}
                    ${cell.userClicked ? "bg-focus/30 border-focus" : ""}
                    ${gameState === "playing" ? "hover:bg-muted/40 cursor-pointer" : "cursor-not-allowed"}
                  `}
                />
              ))}
            </div>

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

export default MemoryMazeQuest;
