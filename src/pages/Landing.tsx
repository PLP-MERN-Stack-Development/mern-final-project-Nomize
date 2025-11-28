import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Zap, Wind, Check } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import heroBrain from "@/assets/hero-brain.jpg";
import focusIcon from "@/assets/focus-quest-icon.png";
import calmIcon from "@/assets/calm-quest-icon.png";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-20" />
        <img 
          src={heroBrain} 
          alt="Cognitive training" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              SDG 3 & 4: Good Health & Quality Education
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Sharpen Focus.<br />
              Train Calm.<br />
              <span className="bg-gradient-to-r from-focus to-speed bg-clip-text text-transparent">
                Level Up Your Mind.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Strengthen your focus, memory, and calmness through short, game-like cognitive exercises designed by psychology experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 shadow-soft hover:shadow-glow transition-all">
                  Start Your Quest
                </Button>
              </Link>
              <Link to="/learn">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quest Types Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Five Cognitive Quests</h2>
            <p className="text-xl text-muted-foreground">
              Each quest trains a different aspect of your cognitive fitness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-focus/20 flex items-center justify-center mb-4">
                  <img src={focusIcon} alt="Focus" className="w-12 h-12" />
                </div>
                <CardTitle className="text-focus">Focus Quest</CardTitle>
                <CardDescription>
                  Train selective and sustained attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Find and click specific shapes in a grid. Improves concentration and reduces distractibility.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-memory/20 flex items-center justify-center mb-4">
                  <Brain className="w-12 h-12 text-memory" />
                </div>
                <CardTitle className="text-memory">Memory Quest</CardTitle>
                <CardDescription>
                  Strengthen working memory and recall
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Remember and reproduce sequences of colors and shapes. Enhances short-term memory capacity.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-speed/20 flex items-center justify-center mb-4">
                  <Zap className="w-12 h-12 text-speed" />
                </div>
                <CardTitle className="text-speed">Speed Quest</CardTitle>
                <CardDescription>
                  Improve processing speed and reaction time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Click target circles as fast as possible. Builds mental agility and impulse control.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-switch/20 flex items-center justify-center mb-4">
                  <Target className="w-12 h-12 text-switch" />
                </div>
                <CardTitle className="text-switch">Brain Switch</CardTitle>
                <CardDescription>
                  Enhance cognitive flexibility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Adapt between changing rules. Strengthens executive function and mental adaptability.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-calm/20 flex items-center justify-center mb-4">
                  <img src={calmIcon} alt="Calm" className="w-12 h-12" />
                </div>
                <CardTitle className="text-calm">Calm Quest</CardTitle>
                <CardDescription>
                  Reduce stress and improve emotional regulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Guided breathing exercises. Decreases cognitive fatigue and enhances self-control.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground">
              Start with a free trial, upgrade anytime
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-secondary mt-0.5" />
                    <span>3 quests per day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-secondary mt-0.5" />
                    <span>All 5 quest types</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-secondary mt-0.5" />
                    <span>Basic stats tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-secondary mt-0.5" />
                    <span>7-day progress history</span>
                  </li>
                </ul>
                <Link to="/auth" className="block">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="shadow-soft border-primary relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-primary text-primary-foreground">Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>For serious brain training</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$4.99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">or $49/year (save 18%)</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="font-medium">Unlimited daily quests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>Full analytics dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>All-time progress history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>Advanced difficulty modes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>Detailed performance insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span>7-day free trial</span>
                  </li>
                </ul>
                <Link to="/auth" className="block">
                  <Button className="w-full shadow-soft">
                    Start Free Trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl font-bold">Ready to Level Up Your Mind?</h2>
            <p className="text-xl opacity-90">
              Join thousands of users improving their cognitive fitness every day.
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-8 shadow-soft">
                Start Your Quest Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 CogniQuest. Supporting UN SDG 3 & 4 - Good Health and Quality Education.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
