import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Brain, TrendingUp, Clock, Calendar, Sparkles, Loader2, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Insights = () => {
  const navigate = useNavigate();
  const { isPremium, loading: subLoading } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<string[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [timeOfDayData, setTimeOfDayData] = useState<any[]>([]);
  const [weeklyComparisonData, setWeeklyComparisonData] = useState<any[]>([]);

  useEffect(() => {
    if (!subLoading && !isPremium) {
      toast({
        title: "Premium Feature",
        description: "AI Insights is available for premium members only.",
        variant: "destructive",
      });
      navigate("/upgrade");
    } else if (!subLoading && isPremium) {
      loadAnalytics();
    }
  }, [isPremium, subLoading, navigate]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch quest results
      const { data: questResults } = await supabase
        .from("quest_results")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      // Fetch profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!questResults || !profile) {
        throw new Error("Failed to load data");
      }

      // Process trend data (last 30 days)
      const last30Days = questResults.slice(0, 30).reverse();
      const trendsByDay = last30Days.reduce((acc: any, result: any) => {
        const date = new Date(result.completed_at).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { date, focus: 0, memory: 0, speed: 0, calm: 0, count: 0 };
        }
        acc[date][result.quest_type] = result.score;
        acc[date].count++;
        return acc;
      }, {});
      setTrendData(Object.values(trendsByDay));

      // Process time of day data
      const timeOfDayMap = questResults.reduce((acc: any, result: any) => {
        const hour = new Date(result.completed_at).getHours();
        const timeSlot = 
          hour < 6 ? "Night (12-6AM)" :
          hour < 12 ? "Morning (6AM-12PM)" :
          hour < 18 ? "Afternoon (12-6PM)" :
          "Evening (6PM-12AM)";
        
        if (!acc[timeSlot]) {
          acc[timeSlot] = { time: timeSlot, averageScore: 0, count: 0 };
        }
        acc[timeSlot].averageScore += result.score;
        acc[timeSlot].count++;
        return acc;
      }, {});

      const timeData = Object.values(timeOfDayMap).map((slot: any) => ({
        time: slot.time,
        averageScore: Math.round(slot.averageScore / slot.count),
      }));
      setTimeOfDayData(timeData);

      // Process weekly comparison data
      const now = new Date();
      const thisWeekStart = new Date(now);
      thisWeekStart.setDate(now.getDate() - now.getDay());
      thisWeekStart.setHours(0, 0, 0, 0);

      const lastWeekStart = new Date(thisWeekStart);
      lastWeekStart.setDate(thisWeekStart.getDate() - 7);

      const thisWeekQuests = questResults.filter((q: any) => 
        new Date(q.completed_at) >= thisWeekStart
      );
      const lastWeekQuests = questResults.filter((q: any) => 
        new Date(q.completed_at) >= lastWeekStart && 
        new Date(q.completed_at) < thisWeekStart
      );

      const weeklyData = [
        {
          week: "Last Week",
          quests: lastWeekQuests.length,
          avgScore: lastWeekQuests.length > 0 
            ? Math.round(lastWeekQuests.reduce((sum: number, q: any) => sum + q.score, 0) / lastWeekQuests.length)
            : 0,
        },
        {
          week: "This Week",
          quests: thisWeekQuests.length,
          avgScore: thisWeekQuests.length > 0
            ? Math.round(thisWeekQuests.reduce((sum: number, q: any) => sum + q.score, 0) / thisWeekQuests.length)
            : 0,
        },
      ];
      setWeeklyComparisonData(weeklyData);

      // Generate AI insights
      const { data: insightData, error: insightError } = await supabase.functions.invoke(
        "generate-insights",
        {
          body: { questResults, profileData: profile },
        }
      );

      if (insightError) {
        console.error("Error generating insights:", insightError);
        setInsights([
          "Keep up your daily training to maintain progress!",
          "Mix different quest types for balanced cognitive development.",
          "Your consistency is paying off - great work!",
        ]);
      } else {
        setInsights(insightData.insights || []);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (subLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-6 h-6" />
              Premium Feature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              AI Insights & Analytics is available for premium members only.
            </p>
            <Button onClick={() => navigate("/upgrade")} className="w-full">
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            AI Insights & Analytics
          </h1>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            ← Back to Dashboard
          </Button>
        </div>

        {/* AI Insights Section */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI-Powered Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-primary/5 rounded-lg border border-primary/10"
                >
                  <p className="text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cognitive Score Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-focus" />
              Cognitive Score Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="focus" stroke="hsl(var(--focus))" />
                <Line type="monotone" dataKey="memory" stroke="hsl(var(--memory))" />
                <Line type="monotone" dataKey="speed" stroke="hsl(var(--speed))" />
                <Line type="monotone" dataKey="calm" stroke="hsl(var(--calm))" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance by Time of Day */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-memory" />
              Performance by Time of Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeOfDayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="averageScore" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Week-over-Week Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-speed" />
              Week-over-Week Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quests" fill="hsl(var(--primary))" name="Quests Completed" />
                <Bar dataKey="avgScore" fill="hsl(var(--focus))" name="Average Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Insights;
