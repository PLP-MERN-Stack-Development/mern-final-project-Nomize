import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Zap, Loader2 } from "lucide-react";
import { usePaystackPayment } from 'react-paystack';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

const Upgrade = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isPremium, loading: subLoading } = useSubscription();
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserEmail(user.email || '');
      setUserId(user.id);
    }
  };

  const PAYSTACK_PUBLIC_KEY = 'pk_test_a18da51f4892a582bc29518581569bc15fab5cfb';

  const monthlyConfig = {
    reference: `${userId}_${Date.now()}`,
    email: userEmail,
    amount: 499900, // NGN 4,999 in kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
    callback_url: "https://cognition-quest-lab.vercel.app/payment-success",
    metadata: {
      user_id: userId,
      plan: 'premium',
      billing_cycle: 'monthly',
      custom_fields: [],
    },
  };

  const annualConfig = {
    reference: `${userId}_annual_${Date.now()}`,
    email: userEmail,
    amount: 4900000, // NGN 49,000 in kobo
    publicKey: PAYSTACK_PUBLIC_KEY,
    callback_url: "https://cognition-quest-lab.vercel.app/payment-success",
    metadata: {
      user_id: userId,
      plan: 'premium',
      billing_cycle: 'annual',
      custom_fields: [],
    },
  };

  const initializeMonthly = usePaystackPayment(monthlyConfig);
  const initializeAnnual = usePaystackPayment(annualConfig);

  const onSuccess = async (reference: any) => {
    console.log('Payment successful:', reference);
    setProcessing(true);
    
    // Manually create subscription since webhook might not work in test mode
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan_type: 'premium',
          status: 'active',
          paystack_reference: reference.reference,
          amount: 4999,
          currency: 'NGN',
          start_date: new Date().toISOString(),
          end_date: null, // Ongoing until cancelled
        }, {
          onConflict: 'user_id'
        });

      if (!error) {
        // Also update profile
        await supabase
          .from('profiles')
          .update({ subscription_tier: 'premium' })
          .eq('id', user.id);
      }
    }
    
    toast({
      title: "Payment successful! 🎉",
      description: "Your premium subscription is now active.",
    });

    // Wait a moment then redirect
    setTimeout(async () => {
  setProcessing(false);
  await supabase.auth.refreshSession();
  navigate('/dashboard');
}, 2000);
};



  const onClose = () => {
    toast({
      title: "Payment cancelled",
      description: "You can upgrade anytime.",
    });
  };

  const handleMonthlyUpgrade = () => {
    if (!userEmail || !userId) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to upgrade.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    if (!PAYSTACK_PUBLIC_KEY || PAYSTACK_PUBLIC_KEY.length === 0) {
      toast({
        title: "Configuration Error",
        description: "Payment system is not properly configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }
    
    initializeMonthly({ onSuccess, onClose });
  };

  const handleAnnualUpgrade = () => {
    if (!userEmail || !userId) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to upgrade.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    if (!PAYSTACK_PUBLIC_KEY || PAYSTACK_PUBLIC_KEY.length === 0) {
      toast({
        title: "Configuration Error",
        description: "Payment system is not properly configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }
    
    initializeAnnual({ onSuccess, onClose });
  };

  const features = [
    { name: "Daily Quests", free: "3 per day", pro: "Unlimited" },
    { name: "Quest Types", free: "All 5", pro: "All 5 + Premium" },
    { name: "Progress History", free: "7 days", pro: "Lifetime" },
    { name: "Detailed Analytics", free: "Basic", pro: "Advanced + AI insights" },
    { name: "Downloadable Reports", free: false, pro: true },
    { name: "Custom Avatars", free: "5 options", pro: "20+ options + upload" },
    { name: "Educational Content", free: "Limited", pro: "Full library + videos" },
    { name: "Achievement Badges", free: "Basic", pro: "Exclusive Pro badges" },
    { name: "Difficulty Levels", free: "Standard", pro: "Adaptive difficulty" },
    { name: "Priority Support", free: false, pro: true },
    { name: "Offline Mode", free: false, pro: true },
    { name: "Ad-Free Experience", free: false, pro: true },
    { name: "Custom Goals & Tracking", free: false, pro: true },
  ];

  if (subLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Upgrade to Pro</h1>
          <p className="text-xl text-muted-foreground">
            Unlock unlimited cognitive training and advanced features
          </p>
          {isPremium && (
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">
              ✓ You're a Premium Member!
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">Free Plan</CardTitle>
              <div className="text-4xl font-bold mt-2">$0</div>
              <p className="text-muted-foreground">Forever</p>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                {isPremium ? 'Downgrade to Free' : 'Current Plan'}
              </Button>
            </CardContent>
          </Card>

          <Card className="relative border-primary border-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
              BEST VALUE
            </div>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                Pro Plan
              </CardTitle>
              <div className="text-4xl font-bold mt-2">₦4,999</div>
              <p className="text-muted-foreground">per month</p>
              <p className="text-sm">or ₦49,000/year (Save 17%)</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleMonthlyUpgrade}
                disabled={isPremium || processing}
              >
                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPremium ? 'Already Premium' : 'Upgrade Monthly'}
              </Button>
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleAnnualUpgrade}
                disabled={isPremium || processing}
              >
                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPremium ? 'Already Premium' : 'Upgrade Yearly (Save 17%)'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Secure payment via Paystack • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold">Free</th>
                    <th className="text-center p-4 font-semibold">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-4">{feature.name}</td>
                      <td className="p-4 text-center">
                        {typeof feature.free === "boolean" ? (
                          feature.free ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="text-muted-foreground">{feature.free}</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {typeof feature.pro === "boolean" ? (
                     +     feature.pro ? (
                            <Check className="h-5 w-5 text-primary mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="text-primary font-semibold">{feature.pro}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pro Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>🚀 Unlimited cognitive training sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>📊 Advanced performance insights and analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>🎯 Personalized learning paths based on your goals</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>🏆 Exclusive achievement badges</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>📚 Full educational library with videos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>💾 Lifetime progress tracking and data export</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Testimonials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="italic">
                  "CogniQuest helped me improve my focus at work by 40% in just 3 weeks!"
                </p>
                <p className="text-sm text-muted-foreground">- Sarah M., Software Engineer</p>
              </div>
              <div className="space-y-2">
                <p className="italic">
                  "The memory quests are game-changing. I can finally remember names!"
                </p>
                <p className="text-sm text-muted-foreground">- James K., Teacher</p>
              </div>
              <div className="space-y-2">
                <p className="italic">
                  "Best investment in myself. My reaction time improved 30% in 2 months."
                </p>
                <p className="text-sm text-muted-foreground">- Alex P., Athlete</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
