import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Brain, Target, Zap, MemoryStick, Shuffle, Heart, BookOpen, Lightbulb, TrendingUp, Lock, Search, Play, Clock } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  videoUrl?: string;
  readTime: number;
  isPremium: boolean;
  tags: string[];
}

const Learn = () => {
  const navigate = useNavigate();
  const { isPremium, loading: subscriptionLoading } = useSubscription();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dailyFreeArticlesRead, setDailyFreeArticlesRead] = useState(0);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  // Check daily limit for free users
  useEffect(() => {
    const checkDailyLimit = async () => {
      if (isPremium) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('daily_limits')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0])
        .single();

      if (data) {
        setDailyFreeArticlesRead(data.quests_completed_today || 0);
      }
    };

    checkDailyLimit();
  }, [isPremium]);

  const articles: Article[] = [
    // FREE ARTICLES (3)
    {
      id: "1",
      title: "Understanding Neuroplasticity: Your Brain's Superpower",
      category: "Neuroscience",
      description: "Discover how your brain rewires itself and why cognitive training works",
      content: `Your brain is constantly rewiring itself based on what you do. This phenomenon is called **neuroplasticity** - the brain's remarkable ability to form new neural connections throughout life.

## How It Works

When you practice cognitive exercises, you're literally strengthening neural pathways, similar to how lifting weights builds muscle. The more you train specific cognitive skills, the more efficient those brain networks become.

## The Science

Neuroplasticity occurs through several mechanisms:
- **Synaptic plasticity**: Existing connections become stronger
- **Neurogenesis**: New neurons are created (especially in the hippocampus)
- **Cortical remapping**: Brain regions reorganize based on use

## Expected Timeline

- **Week 1-2**: Building the habit, establishing baseline
- **Week 3-4**: Noticeable improvements in task performance
- **Month 2-3**: Real-world cognitive benefits emerge
- **Month 3+**: Sustained improvements with continued practice

The key is consistency. Daily 10-minute sessions are more effective than occasional long sessions.`,
      readTime: 5,
      isPremium: false,
      tags: ["neuroscience", "beginner", "fundamentals"]
    },
    {
      id: "2",
      title: "The Science of Focus: Attention Control Fundamentals",
      category: "Focus",
      description: "Learn how attention works and strategies to improve concentration",
      content: `Attention is not a single skill but a complex system with multiple components. Understanding these can help you train more effectively.

## Types of Attention

**Selective Attention**: Focusing on one thing while filtering distractions (trained by Focus Quest)
**Sustained Attention**: Maintaining focus over time
**Divided Attention**: Managing multiple tasks simultaneously
**Alternating Attention**: Switching between tasks (trained by Brain Switch Quest)

## The Prefrontal Cortex Connection

Your prefrontal cortex acts as the brain's CEO, controlling attention and executive function. Regular training strengthens this region.

## Real-World Applications

- Better work productivity and fewer errors
- Enhanced learning and information retention
- Improved driving safety
- Reduced susceptibility to digital distractions

## Training Tips

1. Start with 5-minute sessions and gradually increase
2. Eliminate environmental distractions first
3. Practice mindfulness to strengthen baseline attention
4. Track your progress to stay motivated`,
      readTime: 6,
      isPremium: false,
      tags: ["focus", "attention", "productivity"]
    },
    {
      id: "3",
      title: "Memory Systems: Working Memory vs Long-Term Storage",
      category: "Memory",
      description: "Understand different memory types and how to enhance each",
      content: `Not all memories are created equal. Your brain uses different systems for different types of information.

## Working Memory

Working memory is your brain's "mental workspace" - it holds information temporarily while you work with it. Memory Quest specifically trains this crucial skill.

**Capacity**: Limited to about 7±2 items (Miller's Law)
**Duration**: 15-30 seconds without rehearsal
**Location**: Prefrontal cortex and parietal regions

## Long-Term Memory

Information that's repeatedly used or emotionally significant gets transferred to long-term storage.

**Types**:
- Episodic (personal experiences)
- Semantic (facts and concepts)
- Procedural (skills and habits)

## Enhancement Strategies

**Chunking**: Group information into meaningful units
**Spaced Repetition**: Review material at increasing intervals
**Elaborative Encoding**: Connect new info to existing knowledge
**Sleep**: Memory consolidation happens during sleep

## Daily Practice

The Memory Quest trains working memory capacity through pattern recall, which has been shown to improve overall cognitive function and real-world memory performance.`,
      readTime: 7,
      isPremium: false,
      tags: ["memory", "learning", "neuroscience"]
    },

    // PREMIUM ARTICLES (10+)
    {
      id: "4",
      title: "Advanced Focus Techniques: Flow State Mastery",
      category: "Focus",
      description: "Deep dive into achieving and maintaining flow states for peak performance",
      content: `Flow state represents the pinnacle of focused attention. Learn how to achieve this optimal state consistently.

## The Neuroscience of Flow

During flow, your brain shows:
- Decreased prefrontal activity (transient hypofrontality)
- Increased theta and alpha brainwave activity
- Enhanced dopamine and norepinephrine release
- Improved neural efficiency

## Conditions for Flow

1. **Clear goals**: Know exactly what you're trying to achieve
2. **Immediate feedback**: Instant knowledge of progress
3. **Challenge-skill balance**: Task difficulty matches your ability
4. **Minimal distractions**: Environmental control is crucial

## Training Protocol

Week 1-2: Identify your flow triggers
Week 3-4: Practice entering flow daily for 20 minutes
Week 5+: Extend flow sessions and track performance improvements

## Advanced Strategies

- Pre-flow rituals and environmental cues
- Using binaural beats (40 Hz gamma waves)
- Strategic caffeine timing
- Recovery protocols between flow sessions`,
      videoUrl: "https://www.youtube.com/embed/example1",
      readTime: 12,
      isPremium: true,
      tags: ["focus", "advanced", "flow state", "performance"]
    },
    {
      id: "5",
      title: "The Stroop Effect and Cognitive Control",
      category: "Cognitive Science",
      description: "Understanding interference and how Brain Switch Quest trains cognitive flexibility",
      content: `The Stroop Effect demonstrates the brain's struggle with conflicting information - a key component of cognitive control.

## What Is The Stroop Effect?

Named after psychologist John Ridley Stroop (1935), this phenomenon shows that reading is so automatic that it interferes with color naming.

Example: The word "BLUE" written in red ink causes processing conflict.

## Neural Mechanisms

**Anterior Cingulate Cortex (ACC)**: Detects conflict
**Dorsolateral Prefrontal Cortex (DLPFC)**: Resolves conflict and selects response
**Inhibitory Control**: Suppressing automatic responses

## Why It Matters

Cognitive control is essential for:
- Impulse control and self-regulation
- Multitasking and task-switching
- Emotional regulation
- Creative problem-solving

## Training Applications

Brain Switch Quest uses Stroop-like tasks to strengthen your cognitive control networks. With practice, you'll notice:
- Faster task-switching in daily life
- Better emotional regulation
- Improved decision-making under pressure
- Enhanced creativity (switching perspectives)

## Advanced Training

Combine cognitive flexibility training with mindfulness meditation for synergistic benefits.`,
      videoUrl: "https://www.youtube.com/embed/example2",
      readTime: 10,
      isPremium: true,
      tags: ["cognitive science", "brain switch", "neuroscience"]
    },
    {
      id: "6",
      title: "Processing Speed and Mental Agility Optimization",
      category: "Speed",
      description: "Science-backed strategies to enhance reaction time and decision speed",
      content: `Processing speed is a fundamental cognitive ability that influences nearly every mental task.

## What Determines Processing Speed?

**Myelin**: Insulation around nerve fibers (more = faster signals)
**Neural efficiency**: How well your brain networks communicate
**Neurotransmitter function**: Especially dopamine and acetylcholine
**Brain volume**: Particularly white matter integrity

## Age and Processing Speed

Processing speed typically:
- Peaks in the mid-20s
- Gradually declines from age 30
- **But** training can maintain or improve speed at any age

## Speed Quest Benefits

Research shows reaction time training improves:
- Simple reaction time (by 10-15%)
- Choice reaction time (selecting among options)
- Response inhibition (stopping inappropriate responses)
- Real-world reflexes (driving, sports)

## Optimization Strategies

**Physical Exercise**: Cardio boosts processing speed
**Sleep Quality**: Sleep deprivation severely impairs speed
**Nutrition**: Omega-3s and antioxidants support myelin
**Hydration**: Even 2% dehydration slows processing

## Training Protocol

- Daily Speed Quest sessions
- Progressive difficulty increases
- Track reaction time trends
- Combine with physical reaction training`,
      videoUrl: "https://www.youtube.com/embed/example3",
      readTime: 9,
      isPremium: true,
      tags: ["speed", "reaction time", "optimization"]
    },
    {
      id: "7",
      title: "Mindfulness and Cognitive Performance",
      category: "Calm",
      description: "How meditation enhances brain function and reduces cognitive fatigue",
      content: `Mindfulness meditation isn't just relaxation - it's a powerful cognitive enhancement tool.

## Brain Changes from Meditation

**8-week mindfulness practice increases**:
- Gray matter density in hippocampus (memory)
- Gray matter in PFC (executive function)
- Cortical thickness in attention regions

**Decreases**:
- Amygdala volume (stress response)
- Default mode network activity (mind wandering)

## Calm Quest Science

The 4-4-8 breathing pattern activates:
- Parasympathetic nervous system
- Vagal tone improvement
- Heart rate variability optimization
- Cortisol reduction

## Cognitive Benefits

Studies show regular practice improves:
- Sustained attention by 30%
- Working memory capacity
- Emotional regulation
- Stress resilience
- Creative problem-solving

## Integration Protocol

**Morning**: 5-minute Calm Quest to set the day
**Midday**: Quick breathing exercise during breaks
**Evening**: 10-minute session before bed
**Combination**: Pair with other quests for recovery

## Advanced Techniques

- Body scan meditation
- Loving-kindness practices
- Walking meditation
- Integration with daily activities`,
      videoUrl: "https://www.youtube.com/embed/example4",
      readTime: 11,
      isPremium: true,
      tags: ["mindfulness", "calm", "meditation", "stress"]
    },
    {
      id: "8",
      title: "Working Memory Enhancement: Advanced Strategies",
      category: "Memory",
      description: "Cutting-edge research on expanding working memory capacity",
      content: `Working memory is trainable, and recent research reveals powerful enhancement techniques.

## Dual N-Back Training

The gold standard for working memory training:
- Simultaneous audio and visual sequences
- Adaptive difficulty
- 20 minutes daily shows IQ improvements
- Transfers to fluid intelligence

## Memory Quest Connection

Pattern recall training (Memory Quest) shares mechanisms with dual n-back:
- Requires active maintenance of information
- Demands updating of mental representations
- Builds cognitive load tolerance

## Neuroplastic Changes

Studies using fMRI show working memory training:
- Increases prefrontal and parietal activation
- Enhances dopamine D1 receptor density
- Strengthens frontoparietal network connectivity
- Improves white matter integrity

## Real-World Transfer

Enhanced working memory improves:
- Reading comprehension (holding context)
- Mathematics (mental calculation)
- Learning new skills (instruction retention)
- Social interactions (conversation tracking)
- Problem-solving (maintaining subgoals)

## Optimization Stack

**Combine**:
- Daily Memory Quest sessions
- Adequate sleep (7-9 hours)
- Regular exercise (increases BDNF)
- Strategic nutrition (choline, omega-3s)
- Stress management (cortisol impairs WM)

## Training Schedule

Week 1-4: Build baseline capacity (3-4 item sequences)
Week 5-8: Expand to 5-6 item sequences
Week 9+: Maintain with varied challenges`,
      videoUrl: "https://www.youtube.com/embed/example5",
      readTime: 13,
      isPremium: true,
      tags: ["memory", "working memory", "advanced", "neuroscience"]
    },
    {
      id: "9",
      title: "Sleep and Cognitive Performance Optimization",
      category: "Health",
      description: "Why sleep is your secret weapon for cognitive enhancement",
      content: `Sleep isn't downtime - it's when your brain consolidates learning and performs crucial maintenance.

## Sleep Stages and Cognition

**NREM Stage 3 (Deep Sleep)**:
- Memory consolidation
- Synaptic pruning
- Metabolic waste clearance (glymphatic system)

**REM Sleep**:
- Emotional memory processing
- Creative problem-solving
- Procedural memory consolidation

## Cognitive Costs of Sleep Deprivation

Just one night of poor sleep impairs:
- Reaction time (by 50%)
- Working memory capacity
- Attention and vigilance
- Decision-making quality
- Emotional regulation

## Optimization Strategies

**Sleep Hygiene Essentials**:
- Consistent sleep schedule (even weekends)
- Cool room temperature (65-68°F)
- Complete darkness (blackout curtains)
- No screens 1 hour before bed
- Caffeine cutoff at 2 PM

**Enhancement Tools**:
- White noise or pink noise
- Weighted blankets
- Magnesium glycinate supplement
- Evening Calm Quest session
- Sleep tracking for optimization

## Training Connection

Cognitive gains from daytime training consolidate during sleep. For maximum benefit:
- Train in morning or early afternoon
- Never sacrifice sleep for training
- Use evening Calm Quest to improve sleep quality
- Track correlation between sleep and performance

## Power Naps

20-minute naps boost:
- Alertness
- Memory consolidation
- Creative problem-solving
- Afternoon performance`,
      videoUrl: "https://www.youtube.com/embed/example6",
      readTime: 10,
      isPremium: true,
      tags: ["sleep", "health", "optimization", "performance"]
    },
    {
      id: "10",
      title: "Nutrition for Cognitive Enhancement",
      category: "Health",
      description: "Evidence-based nutritional strategies to boost brain performance",
      content: `Your brain is metabolically expensive - it uses 20% of your calories. Optimize fuel for optimal performance.

## Essential Nutrients for Cognition

**Omega-3 Fatty Acids (DHA/EPA)**:
- Brain structure and function
- Reduces inflammation
- Enhances memory and focus
- Sources: Fatty fish, algae oil

**B Vitamins**:
- Energy metabolism
- Neurotransmitter synthesis
- Myelin maintenance
- Sources: Leafy greens, eggs, meat

**Choline**:
- Acetylcholine production (memory)
- Cell membrane integrity
- Sources: Eggs, liver, soybeans

**Antioxidants**:
- Protect against oxidative stress
- Maintain cognitive function with age
- Sources: Berries, dark chocolate, green tea

## Strategic Caffeine Use

Caffeine enhances:
- Alertness and vigilance
- Reaction time
- Working memory (short-term)

**Optimal Protocol**:
- 100-200mg dose
- Take 1 hour before cognitive tasks
- Cutoff at 2 PM for sleep
- Cycle use to prevent tolerance

## Pre-Quest Nutrition

**Before Focus/Speed Quests**:
- Light protein + complex carbs
- Hydrate well (16oz water)
- Optional: Green tea (L-theanine + caffeine)

**Before Memory Quest**:
- Healthy fats (omega-3s)
- Moderate caffeine
- Avoid heavy meals

**Before Calm Quest**:
- Light meal only
- Herbal tea (chamomile)
- Avoid caffeine

## Hydration

Even 2% dehydration impairs:
- Processing speed
- Working memory
- Attention
- Mood and motivation

**Target**: 0.5-1 oz per pound of body weight daily`,
      videoUrl: "https://www.youtube.com/embed/example7",
      readTime: 12,
      isPremium: true,
      tags: ["nutrition", "health", "supplements", "performance"]
    },
    {
      id: "11",
      title: "Exercise and Brain Health: The Complete Guide",
      category: "Health",
      description: "How physical activity supercharges cognitive function and neuroplasticity",
      content: `Exercise is the single most powerful intervention for brain health and cognitive enhancement.

## Neurobiological Mechanisms

**BDNF (Brain-Derived Neurotrophic Factor)**:
- "Miracle-Gro for the brain"
- Increases with aerobic exercise
- Promotes neurogenesis
- Enhances synaptic plasticity

**Cerebral Blood Flow**:
- Exercise increases blood flow to brain
- Delivers oxygen and nutrients
- Removes metabolic waste
- Improves vascular health

**Neurotransmitters**:
- Dopamine (motivation, focus)
- Serotonin (mood, executive function)
- Norepinephrine (arousal, attention)

## Types of Exercise and Cognitive Benefits

**Aerobic Exercise**:
- Best for memory and learning
- Increases hippocampal volume
- 150 minutes/week recommended
- Examples: Running, cycling, swimming

**Resistance Training**:
- Improves executive function
- Enhances focus and planning
- 2-3 sessions/week
- Examples: Weightlifting, bodyweight exercises

**Coordination Training**:
- Boosts processing speed
- Enhances motor learning
- Examples: Dancing, martial arts, sports

## Optimal Training Protocol

**For Cognitive Enhancement**:
- 30-45 minutes moderate intensity
- 4-5 days per week
- Morning sessions boost daily cognition
- Combine with CogniQuest training

**Timing**:
- Exercise before cognitive training (primes brain)
- Or exercise after (consolidates learning)
- Avoid intense exercise right before quests (fatigue)

## Synergistic Effects

Combining exercise + cognitive training > either alone:
- Greater BDNF increases
- Enhanced neuroplasticity
- Better long-term retention
- Mood and motivation benefits

## Practical Integration

**Morning Routine**:
1. Light cardio (20 min)
2. Focus Quest or Memory Quest
3. Healthy breakfast

**Lunch Break**:
1. Brief walk (10 min)
2. Speed Quest or Brain Switch Quest

**Evening**:
1. Calm Quest
2. Stretching or yoga`,
      videoUrl: "https://www.youtube.com/embed/example8",
      readTime: 14,
      isPremium: true,
      tags: ["exercise", "health", "neuroplasticity", "BDNF"]
    },
    {
      id: "12",
      title: "Stress Management and Cognitive Resilience",
      category: "Mental Health",
      description: "Build cognitive resilience and perform under pressure",
      content: `Chronic stress is the enemy of cognitive performance. Learn to build resilience.

## How Stress Affects Cognition

**Acute Stress** (short-term):
- Sharpens focus and alertness
- Enhances memory encoding
- Useful for performance

**Chronic Stress** (long-term):
- Impairs working memory
- Reduces hippocampal volume
- Weakens prefrontal function
- Increases amygdala reactivity

## The Cortisol Connection

Cortisol (stress hormone):
- Necessary in small doses
- Toxic at high levels
- Damages hippocampal neurons
- Impairs memory consolidation

## Building Cognitive Resilience

**Calm Quest Benefits**:
- Activates parasympathetic nervous system
- Reduces cortisol levels
- Increases vagal tone
- Builds stress resilience over time

**Additional Strategies**:
- Regular exercise (reduces baseline cortisol)
- Quality sleep (cortisol regulation)
- Social connection (oxytocin buffering)
- Nature exposure (attention restoration)
- Gratitude practice (shifts perspective)

## Performance Under Pressure

**Pre-Performance Routine**:
1. Calm Quest breathing (2-3 minutes)
2. Visualization of success
3. Positive self-talk
4. Physical movement (shake out tension)

**During High-Stress Periods**:
- Multiple daily Calm Quest sessions
- Reduce other quest difficulty temporarily
- Prioritize sleep and nutrition
- Maintain exercise routine
- Seek social support

## Long-Term Resilience Building

Week 1-4: Daily Calm Quest practice
Week 5-8: Add stress inoculation (challenging quests)
Week 9+: Maintain balance of challenge and recovery

## Warning Signs

Watch for:
- Declining quest performance
- Irritability or mood changes
- Sleep disruption
- Reduced motivation

Action: Increase Calm Quest frequency, reduce intensity of other training`,
      videoUrl: "https://www.youtube.com/embed/example9",
      readTime: 11,
      isPremium: true,
      tags: ["stress", "mental health", "resilience", "cortisol"]
    },
    {
      id: "13",
      title: "Cognitive Aging: Maintaining Mental Sharpness",
      category: "Neuroscience",
      description: "Science-backed strategies to preserve and enhance cognitive function with age",
      content: `Aging doesn't have to mean cognitive decline. Research shows you can maintain and even improve mental sharpness.

## Normal Aging vs Pathological Decline

**Normal Age-Related Changes**:
- Slower processing speed (begins age 30)
- Mild working memory decline
- Word-finding difficulties
- **BUT** wisdom, vocabulary, and expertise increase

**Protective Factors**:
- Education level
- Cognitive engagement
- Physical fitness
- Social connections
- Healthy lifestyle

## Cognitive Reserve Theory

Some brains tolerate more damage before showing impairment:
- Rich neural networks
- Efficient processing
- Compensatory mechanisms
- **Built through lifelong learning**

## CogniQuest for Healthy Aging

All quest types benefit aging brains:

**Focus Quest**: Maintains attentional control
**Memory Quest**: Preserves working memory
**Speed Quest**: Slows processing speed decline
**Brain Switch Quest**: Maintains cognitive flexibility
**Calm Quest**: Reduces inflammation and stress

## Research Evidence

Studies show cognitive training:
- Improves processing speed (75% of participants)
- Enhances memory (40% improvement)
- Transfers to daily activities
- Effects last 5-10 years post-training

## Comprehensive Brain Health Protocol

**Daily**:
- 20 minutes CogniQuest training (varied)
- 30 minutes aerobic exercise
- 7-9 hours sleep
- Social interaction

**Weekly**:
- Learn something new
- Resistance training (2-3x)
- Novel experiences

**Monthly**:
- Challenge yourself with new skills
- Social activities
- Nature exposure

## Nutrition for Brain Aging

**Mediterranean-MIND Diet**:
- Leafy greens daily
- Berries, nuts, olive oil
- Fish 2x/week
- Whole grains
- Limit red meat and sweets

**Key Supplements** (with doctor approval):
- Omega-3 EPA/DHA
- Vitamin D
- B-complex vitamins
- CoQ10 (if over 50)

## Warning Signs to Monitor

See a doctor if you experience:
- Significant memory problems affecting daily life
- Difficulty with familiar tasks
- Confusion about time or place
- Changes in mood or personality

**But remember**: Mild forgetfulness is normal. Don't panic!`,
      videoUrl: "https://www.youtube.com/embed/example10",
      readTime: 15,
      isPremium: true,
      tags: ["aging", "brain health", "prevention", "longevity"]
    },
    {
      id: "14",
      title: "The Science of Habit Formation for Cognitive Training",
      category: "Psychology",
      description: "Build a sustainable cognitive training routine using behavioral science",
      content: `Consistency beats intensity. Learn how to make cognitive training an effortless habit.

## The Habit Loop

Every habit follows this pattern:
1. **Cue**: Trigger for the behavior
2. **Routine**: The behavior itself
3. **Reward**: Benefit that reinforces the behavior

## Building Your CogniQuest Habit

**Optimal Cue Design**:
- Time-based: "After morning coffee"
- Location-based: "At my desk"
- Event-based: "After breakfast"
- Existing habit: "After brushing teeth"

**Make It Easy**:
- Start small (5 minutes)
- Remove friction (app open, notifications on)
- Environment design (phone on desk)
- Never miss twice in a row

**Reward System**:
- Track streaks (built-in motivation)
- Celebrate XP gains
- Notice real-world improvements
- Social accountability

## The 21/66 Day Myth

**Reality**:
- Simple habits: 21 days average
- Complex habits: 66 days average
- **Cognitive training**: 30-45 days typical

**Keys to Success**:
1. Consistency over perfection
2. Identity-based ("I'm someone who trains daily")
3. Environmental cues
4. Stack with existing habits

## Preventing Habit Decay

**Common Obstacles**:
- Travel: Use mobile app
- Sickness: Do Calm Quest only
- Boredom: Vary quest types
- Plateau: Adjust difficulty

**Recovery Protocol**:
- Miss 1 day: Resume immediately
- Miss 2 days: Analyze why
- Miss 3+ days: Restart with easier goals

## Gamification Psychology

CogniQuest uses proven engagement mechanics:
- **Progress bars**: Visual motivation
- **Levels**: Long-term goals
- **Streaks**: Daily consistency
- **Achievements**: Milestone celebration
- **Leaderboards** (coming soon): Social competition

## Optimal Training Schedule

**Beginners**:
- 5-10 minutes daily
- 1-2 quest types
- Focus on consistency

**Intermediate**:
- 15-20 minutes daily
- 3-4 quest types
- Progressive difficulty

**Advanced**:
- 20-30 minutes daily
- All quest types
- Performance tracking and optimization

## Motivation Science

**Intrinsic Motivation** (sustainable):
- Enjoyment of the activity
- Personal growth satisfaction
- Mastery pursuit

**Extrinsic Motivation** (short-term):
- Rewards and achievements
- Competition
- External praise

**Strategy**: Start with extrinsic (gamification), transition to intrinsic (personal growth)`,
      videoUrl: "https://www.youtube.com/embed/example11",
      readTime: 13,
      isPremium: true,
      tags: ["habits", "psychology", "motivation", "consistency"]
    }
  ];

  const categories = ["all", "Neuroscience", "Focus", "Memory", "Speed", "Cognitive Science", "Calm", "Health", "Mental Health", "Psychology"];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Free users can access first 3 free articles
  const displayedArticles = isPremium ? filteredArticles : filteredArticles.filter(a => !a.isPremium).slice(0, 3);

  const handleArticleClick = async (article: Article) => {
    if (article.isPremium && !isPremium) {
      toast.error("Premium Content", {
        description: "Upgrade to Premium to access this article and all video lessons."
      });
      navigate('/upgrade');
      return;
    }

    if (!isPremium && !article.isPremium) {
      // Check daily limit for free users
      if (dailyFreeArticlesRead >= 3) {
        toast.error("Daily Limit Reached", {
          description: "Free users can read 3 articles per day. Upgrade to Premium for unlimited access."
        });
        navigate('/upgrade');
        return;
      }

      // Increment daily counter
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('daily_limits')
          .upsert({
            user_id: user.id,
            date: new Date().toISOString().split('T')[0],
            quests_completed_today: dailyFreeArticlesRead + 1
          }, {
            onConflict: 'user_id,date'
          });

        if (!error) {
          setDailyFreeArticlesRead(prev => prev + 1);
        }
      }
    }

    setExpandedArticle(expandedArticle === article.id ? null : article.id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-background py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4">
            <BookOpen className="w-16 h-16 mx-auto text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Knowledge Library</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the science of cognitive training and brain health
            </p>
            {!isPremium && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>Free: {dailyFreeArticlesRead}/3 articles today</span>
                <Button variant="link" onClick={() => navigate('/upgrade')} className="h-auto p-0">
                  Upgrade for unlimited access
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12 space-y-8">
        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search articles by title, topic, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {displayedArticles.map(article => (
            <Card 
              key={article.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                article.isPremium && !isPremium ? 'opacity-75 relative' : ''
              }`}
              onClick={() => handleArticleClick(article)}
            >
              {article.isPremium && !isPremium && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    <Lock className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{article.category}</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readTime} min read
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                    <CardDescription>{article.description}</CardDescription>
                  </div>
                </div>
                {article.videoUrl && isPremium && (
                  <Badge variant="secondary" className="mt-2 w-fit">
                    <Play className="w-3 h-3 mr-1" />
                    Video Lesson
                  </Badge>
                )}
              </CardHeader>
              {expandedArticle === article.id && (
                <CardContent className="space-y-4 border-t pt-6">
                  {article.videoUrl && isPremium && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <iframe
                        width="100%"
                        height="100%"
                        src={article.videoUrl}
                        title={article.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {article.content.split('\n').map((paragraph, i) => {
                      if (paragraph.startsWith('##')) {
                        return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{paragraph.replace('## ', '')}</h3>;
                      } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return <p key={i} className="font-semibold mt-3">{paragraph.replace(/\*\*/g, '')}</p>;
                      } else if (paragraph.startsWith('- ')) {
                        return <li key={i} className="ml-4">{paragraph.replace('- ', '')}</li>;
                      } else if (paragraph.trim()) {
                        return <p key={i} className="mb-3 text-muted-foreground">{paragraph}</p>;
                      }
                      return null;
                    })}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          {/* Locked Premium Articles Preview */}
          {!isPremium && filteredArticles.filter(a => a.isPremium).slice(0, 6).map(article => (
            <Card 
              key={article.id} 
              className="cursor-pointer transition-all hover:shadow-lg opacity-60 relative"
              onClick={() => handleArticleClick(article)}
            >
              <div className="absolute inset-0 backdrop-blur-[2px] bg-background/40 z-10 flex items-center justify-center rounded-lg">
                <div className="text-center p-6">
                  <Lock className="w-12 h-12 mx-auto mb-3 text-amber-500" />
                  <p className="font-semibold mb-2">Premium Content</p>
                  <Button size="sm" onClick={() => navigate('/upgrade')}>
                    Upgrade to Read
                  </Button>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{article.category}</Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readTime} min read
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{article.title}</CardTitle>
                    <CardDescription>{article.description}</CardDescription>
                  </div>
                </div>
                {article.videoUrl && (
                  <Badge variant="secondary" className="mt-2 w-fit bg-amber-500/20 text-amber-600">
                    <Play className="w-3 h-3 mr-1" />
                    Video Lesson
                  </Badge>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Upgrade CTA for Free Users */}
        {!isPremium && (
          <Card className="bg-gradient-to-r from-primary/10 to-amber-500/10 border-2">
            <CardContent className="text-center py-12">
              <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Unlock Full Knowledge Library</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get unlimited access to 10+ premium articles, video lessons, and advanced training protocols
              </p>
              <Button size="lg" onClick={() => navigate("/upgrade")}>
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Learn;