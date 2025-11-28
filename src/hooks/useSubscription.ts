import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Subscription {
  id: string;
  user_id: string;
  plan_type: string;
  status: string;
  paystack_reference: string | null;
  amount: number | null;
  currency: string;
  start_date: string;
  end_date: string | null;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    fetchSubscription();

    // Subscribe to subscription changes
    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
        },
        () => {
          fetchSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
      } else if (data) {
        setSubscription(data);
        
        // Check if premium is active
        const isActive = 
          data.status === 'active' && 
          data.plan_type === 'premium' &&
          (!data.end_date || new Date(data.end_date) > new Date());
        
        setIsPremium(isActive);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setLoading(false);
    }
  };

  return { subscription, isPremium, loading, refetch: fetchSubscription };
};
