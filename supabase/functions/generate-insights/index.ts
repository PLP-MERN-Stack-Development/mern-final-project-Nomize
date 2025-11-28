import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questResults, profileData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Prepare data summary for AI
    const dataSummary = {
      totalQuests: questResults.length,
      averageScores: {
        focus: profileData.focus_score || 0,
        memory: profileData.memory_score || 0,
        speed: profileData.speed_score || 0,
        calm: profileData.calm_score || 0,
      },
      currentLevel: profileData.current_level || 1,
      streakDays: profileData.streak_days || 0,
      recentPerformance: questResults.slice(0, 10).map((r: any) => ({
        type: r.quest_type,
        score: r.score,
        accuracy: r.accuracy,
        date: r.completed_at,
      })),
    };

    const prompt = `You are a cognitive training expert analyzing user performance data. 

User Stats:
- Total Quests Completed: ${dataSummary.totalQuests}
- Current Streak: ${dataSummary.streakDays} days
- Level: ${dataSummary.currentLevel}
- Cognitive Scores:
  * Focus: ${dataSummary.averageScores.focus}
  * Memory: ${dataSummary.averageScores.memory}
  * Speed: ${dataSummary.averageScores.speed}
  * Calm: ${dataSummary.averageScores.calm}

Recent Performance:
${JSON.stringify(dataSummary.recentPerformance, null, 2)}

Generate 4-5 actionable insights about this user's cognitive training. Each insight should be:
1. Specific and data-driven
2. Encouraging but honest
3. Include a concrete recommendation
4. 1-2 sentences maximum

Format as a JSON array of strings. Example:
["Your focus peaks at 10 AM - schedule important tasks then", "Memory improved 23% this month - keep it up!"]`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are a cognitive training expert. Provide insights in JSON array format only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('Failed to generate insights');
    }

    const data = await response.json();
    const insightsText = data.choices[0].message.content;
    
    // Parse JSON from AI response
    let insights: string[];
    try {
      insights = JSON.parse(insightsText);
    } catch {
      // Fallback if AI didn't return valid JSON
      insights = [
        "Keep up your daily training to maintain your streak!",
        "Try mixing different quest types for balanced cognitive development.",
        "Your consistency is paying off - you're making great progress!",
      ];
    }

    return new Response(
      JSON.stringify({ insights }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-insights:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
