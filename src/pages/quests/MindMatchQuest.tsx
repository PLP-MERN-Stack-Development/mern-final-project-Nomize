import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, Trophy } from "lucide-react";
import { playSound } from "@/utils/sounds";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";

const SYMBOLS = ["🎯", "⭐", "🔥", "💎", "🌙", "☀️", "🎨", "🎪"];

type CardType = {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
};

const MindMatchQuest = () => {
  const navigate = useNavigate();
  const { isPremium, loading } = useSubscription();
  const [gameState, setGameState] = useState<"idle" | "playing" | "complete">("idle");
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!loading && !isPremium) {
      toast({
        title: "Premium Feature",
        description: "Mind Match is a premium quest. Upgrade to unlock!",
        variant: "destructive",
      });
      navigate("/upgrade");
    }
  }, [isPremium, loading, navigate]);

  const startGame = () => {
    playSound("click");
    const shuffled = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, idx) => ({
        id: idx,
        symbol,
        flipped: false,
        matched: false,
      }));

    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setScore(1000);
    setGameState("playing");
  };

  const handleCardClick = (cardId: number) => {
    if (gameState !== "playing") return;
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;

    const card = cards.find((c) => c.id === cardId);
    if (card?.matched) return;

    playSound("click");
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, flipped: true } : c))
    );

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [first, second] = newFlipped;
      const firstCard = cards.find((c) => c.id === first);
      const secondCard = cards.find((c) => c.id === second);

      if (firstCard?.symbol === secondCard?.symbol) {
        playSound("correct");
        setCards((prev) =>
          prev.map((c) =>
            c.id === first || c.id === second ? { ...c, matched: true } : c
          )
        );
        setMatches((prev) => prev + 1);
        setScore((prev) => prev + 50);
        setFlippedCards([]);

        if (matches + 1 === SYMBOLS.length) {
          setTimeout(() => {
            playSound("questComplete");
            setGameState("complete");
          }, 500);
        }
      } else {
        playSound("wrong");
        setScore((prev) => Math.max(0, prev - 10));
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second ? { ...c, flipped: false } : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
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
              Mind Match
              <span className="ml-auto text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                PREMIUM
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Moves: {moves}</span>
              <span>Score: {score}</span>
              <span>
                Matches: {matches}/{SYMBOLS.length}
              </span>
            </div>

            {gameState === "idle" && (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Match all pairs with the fewest moves possible!
                </p>
                <Button onClick={startGame} size="lg">
                  Start Quest
                </Button>
              </div>
            )}

            {(gameState === "playing" || gameState === "complete") && (
              <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    disabled={gameState !== "playing" || card.matched}
                    className={`
                      aspect-square rounded-lg border-2 text-4xl transition-all
                      ${
                        card.flipped || card.matched
                          ? "bg-primary/20 border-primary"
                          : "bg-muted border-muted"
                      }
                      ${card.matched ? "opacity-50" : ""}
                      ${gameState === "playing" && !card.matched ? "hover:bg-muted/60 cursor-pointer" : "cursor-not-allowed"}
                    `}
                  >
                    {card.flipped || card.matched ? card.symbol : "❓"}
                  </button>
                ))}
              </div>
            )}

            {gameState === "complete" && (
              <div className="text-center space-y-4 p-6 bg-muted/50 rounded-lg mt-6">
                <Trophy className="w-16 h-16 mx-auto text-primary" />
                <h3 className="text-2xl font-bold">Quest Complete!</h3>
                <p className="text-xl">Final Score: {score}</p>
                <p className="text-muted-foreground">Completed in {moves} moves!</p>
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

export default MindMatchQuest;
