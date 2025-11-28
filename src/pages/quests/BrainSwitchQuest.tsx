import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { calculateLevel } from "@/utils/levelSystem";
import { playSound } from "@/utils/sounds";

type RuleType = "even" | "odd" | "blue" | "red" | "word-match" | "word-blue";
type Color = "blue" | "red" | "green" | "yellow";
type StimulusType = "number" | "word";

interface Item {
  type: StimulusType;
  value: number | string;
  color: Color;
  shouldClick: boolean;
}

const COLOR_WORDS = ["RED", "BLUE", "GREEN", "YELLOW"];

const BrainSwitchQuest = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [currentRule, setCurrentRule] = useState<RuleType>("even");
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [itemIndex, setItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [switchCount, setSwitchCount] = useState(0);
  const [appearTime, setAppearTime] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [ruleJustSwitched, setRuleJustSwitched] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [encouragementMessage, setEncouragementMessage] = useState("");

  const totalItemCount = 24;
  const ITEM_DISPLAY_TIME = 2500;
  const RULE_CHANGE_DELAY = 1000;

  const RULES: RuleType[] = ["even", "odd", "blue", "red", "word-match", "word-blue"];

  const getRuleDescription = (rule: RuleType) => {
    switch (rule) {
      case "even": return "Click if NUMBER is EVEN";
      case "odd": return "Click if NUMBER is ODD";
      case "blue": return "Click if COLOR is BLUE";
      case "red": return "Click if COLOR is RED";
      case "word-match": return "Click if WORD matches INK COLOR";
      case "word-blue": return "Click if WORD says BLUE";
    }
  };

  const generateItem = (rule: RuleType): Item => {
    // Determine if we should show number or word
    const isWordStimulus = rule === "word-match" || rule === "word-blue";
    
    if (isWordStimulus) {
      // Generate Stroop word stimulus
      const word = COLOR_WORDS[Math.floor(Math.random() * COLOR_WORDS.length)];
      const colors: Color[] = ["blue", "red", "green", "yellow"];
      const inkColor = colors[Math.floor(Math.random() * colors.length)];
      
      let shouldClick = false;
      if (rule === "word-match") {
        shouldClick = word.toLowerCase() === inkColor;
      } else if (rule === "word-blue") {
        shouldClick = word === "BLUE";
      }
      
      return { type: "word", value: word, color: inkColor, shouldClick };
    } else {
      // Generate number stimulus
      const number = Math.floor(Math.random() * 8) + 2; // 2-9
      const colors: Color[] = ["blue", "red", "green", "yellow"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      let shouldClick = false;
      if (rule === "even") {
        shouldClick = number % 2 === 0;
      } else if (rule === "odd") {
        shouldClick = number % 2 === 1;
      } else if (rule === "blue") {
        shouldClick = color === "blue";
      } else if (rule === "red") {
        shouldClick = color === "red";
      }
      
      return { type: "number", value: number, color, shouldClick };
    }
  };

  const showEncouragement = (message: string) => {
    setEncouragementMessage(message);
    setTimeout(() => setEncouragementMessage(""), 1500);
  };

  const startGame = () => {
    setGameState("playing");
    setCurrentRule("even");
    setItemIndex(0);
    setScore(0);
    setCorrectClicks(0);
    setTotalItems(0);
    setSwitchCount(0);
    setReactionTimes([]);
    setEncouragementMessage("");
    showNextItem(0, "even");
  };

  const showNextItem = (index: number, rule: RuleType) => {
    if (index >= totalItemCount) {
      finishGame();
      return;
    }

    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    // Switch rule every 6 items
    let newRule = rule;
    if (index > 0 && index % 6 === 0) {
      const currentRuleIndex = RULES.indexOf(rule);
      const nextRuleIndex = (currentRuleIndex + 1) % RULES.length;
      newRule = RULES[nextRuleIndex];
      
      setCurrentRule(newRule);
      setSwitchCount((prev) => prev + 1);
      setRuleJustSwitched(true);
      setIsProcessing(true);
      playSound("ruleChange");
      
      // Show rule change screen
      setTimeout(() => {
        setRuleJustSwitched(false);
        setIsProcessing(false);
        const item = generateItem(newRule);
        setCurrentItem(item);
        setAppearTime(Date.now());
        setItemIndex(index);
        
        const timeout = setTimeout(() => {
          handleTimeout();
        }, ITEM_DISPLAY_TIME);
        setTimeoutId(timeout);
      }, RULE_CHANGE_DELAY);
      
      return;
    }

    setRuleJustSwitched(false);
    setIsProcessing(false);
    const item = generateItem(newRule);
    setCurrentItem(item);
    setAppearTime(Date.now());
    setItemIndex(index);

    const timeout = setTimeout(() => {
      handleTimeout();
    }, ITEM_DISPLAY_TIME);
    setTimeoutId(timeout);
  };

  const handleClick = () => {
    if (!currentItem || gameState !== "playing" || isProcessing || ruleJustSwitched) return;

    // Clear the auto-advance timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }

    setIsProcessing(true);
    const reactionTime = Date.now() - appearTime;
    setTotalItems((prev) => prev + 1);

    if (currentItem.shouldClick) {
      playSound('correct');
      setScore((prev) => prev + 10);
      setCorrectClicks((prev) => prev + 1);
      setReactionTimes((prev) => [...prev, reactionTime]);
      
      const messages = ["Good!", "Nice!", "Great!", "Excellent!", "Perfect!"];
      showEncouragement(messages[Math.floor(Math.random() * messages.length)]);
    } else {
      playSound('wrong');
      toast.error("Wrong! You shouldn't have clicked that one.");
    }

    setCurrentItem(null);
    setTimeout(() => showNextItem(itemIndex + 1, currentRule), 300);
  };

  const handleTimeout = () => {
    if (!currentItem || gameState !== "playing" || isProcessing) return;

    setIsProcessing(true);
    setTotalItems((prev) => prev + 1);

    if (!currentItem.shouldClick) {
      setScore((prev) => prev + 10);
      setCorrectClicks((prev) => prev + 1);
      
      const messages = ["Good!", "Nice!", "Correct!"];
      showEncouragement(messages[Math.floor(Math.random() * messages.length)]);
    } else {
      playSound('wrong');
    }

    setCurrentItem(null);
    setTimeout(() => showNextItem(itemIndex + 1, currentRule), 300);
  };

  const finishGame = async () => {
    setGameState("finished");
    playSound('questComplete');
    
    const accuracy = totalItems > 0 ? (correctClicks / totalItems) * 100 : 0;
    const avgReactionTime = reactionTimes.length > 0
      ? Math.floor(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;
    const xpEarned = Math.floor(score * 1.5);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("quest_results").insert({
          user_id: user.id,
          quest_type: "switch",
          accuracy: accuracy,
          score: score,
          xp_earned: xpEarned,
          items_completed: correctClicks,
          reaction_time: avgReactionTime,
        });

        const { data: profile } = await supabase
          .from("profiles")
          .select("xp_points, current_level")
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

  const getColorClass = (color: Color) => {
    switch (color) {
      case "blue": return "text-primary";
      case "red": return "text-focus";
      case "green": return "text-calm";
      case "yellow": return "text-speed";
    }
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
              <CardTitle className="text-switch">Brain Switch Quest</CardTitle>
              {gameState === "playing" && (
                <div className="text-xl font-bold">{itemIndex + 1}/{totalItemCount}</div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {gameState === "idle" && (
              <div className="text-center space-y-6 py-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Train Cognitive Flexibility</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Follow the rule at the top. The rule will switch every 6 items - stay sharp!
                  </p>
                  <div className="bg-muted p-4 rounded-lg max-w-lg mx-auto mt-4">
                    <p className="font-semibold mb-2">6 Rule Types:</p>
                    <div className="text-sm space-y-1 text-left">
                      <p>1. Click if NUMBER is EVEN</p>
                      <p>2. Click if NUMBER is ODD</p>
                      <p>3. Click if COLOR is BLUE</p>
                      <p>4. Click if COLOR is RED</p>
                      <p>5. Click if WORD matches INK COLOR (Stroop)</p>
                      <p>6. Click if WORD says BLUE</p>
                    </div>
                  </div>
                </div>
                <Button size="lg" onClick={startGame} className="bg-switch hover:bg-switch/90">
                  Start Quest
                </Button>
              </div>
            )}

            {gameState === "playing" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className={`text-center p-4 rounded-lg transition-all ${
                    ruleJustSwitched ? "bg-switch/20 border-2 border-switch animate-pulse" : "bg-muted"
                  }`}>
                    <div className="flex items-center justify-center gap-2 text-xl font-bold">
                      <RefreshCw className={`w-5 h-5 ${ruleJustSwitched ? "animate-spin" : ""}`} />
                      {ruleJustSwitched ? "⚡ NEW RULE!" : `RULE: ${getRuleDescription(currentRule)}`}
                    </div>
                  </div>
                  <Progress value={(itemIndex / totalItemCount) * 100} className="h-2" />
                </div>

                {!ruleJustSwitched && currentItem && (
                  <div className="flex flex-col items-center justify-center py-12 relative">
                    <button
                      onClick={handleClick}
                      className={`text-9xl font-bold ${getColorClass(currentItem.color)} hover:scale-110 transition-transform cursor-pointer`}
                    >
                      {currentItem.value}
                    </button>
                    <p className="text-sm text-muted-foreground mt-4">
                      Click if it matches the rule, or wait if it doesn't
                    </p>
                    {encouragementMessage && (
                      <div className="absolute top-0 text-3xl font-bold text-calm animate-bounce">
                        {encouragementMessage}
                      </div>
                    )}
                  </div>
                )}

                {ruleJustSwitched && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-4xl font-bold text-switch animate-bounce">
                      ⚡ NEW RULE! ⚡
                    </div>
                    <p className="text-xl mt-4">
                      {getRuleDescription(currentRule)}
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-8 text-lg">
                  <div>Score: <span className="font-bold text-switch">{score}</span></div>
                  <div>Correct: <span className="font-bold text-calm">{correctClicks}</span></div>
                </div>
              </div>
            )}

            {gameState === "finished" && (
              <div className="text-center space-y-6 py-8">
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-switch">Quest Complete! 🧠</h3>
                  <div className="text-5xl font-bold text-primary my-4">
                    +{Math.floor(score * 1.5)} XP
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold">
                        {totalItems > 0 ? ((correctClicks / totalItems) * 100).toFixed(0) : 0}%
                      </div>
                      <div className="text-sm text-muted-foreground">Accuracy</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold">{switchCount}</div>
                      <div className="text-sm text-muted-foreground">Rule Switches</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-2xl font-bold">
                        {reactionTimes.length > 0 
                          ? Math.floor(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
                          : 0}ms
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Time</div>
                    </CardContent>
                  </Card>
                </div>

                <p className="text-muted-foreground">Your brain is becoming more flexible!</p>

                <div className="flex gap-4 justify-center">
                  <Button onClick={startGame} className="bg-switch hover:bg-switch/90">
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

export default BrainSwitchQuest;
