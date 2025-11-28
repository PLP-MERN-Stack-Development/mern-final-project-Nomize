import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaystackWebhookEvent {
  event: string;
  data: {
    reference: string;
    amount: number;
    customer: {
      email: string;
    };
    status: string;
    metadata?: {
      user_id: string;
      plan: string;
    };
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY not found');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify webhook signature
    const signature = req.headers.get('x-paystack-signature');
    const body = await req.text();
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(paystackSecretKey),
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    );
    
    const hash = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
    const computedSignature = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (signature !== computedSignature) {
      console.error('Invalid webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const event: PaystackWebhookEvent = JSON.parse(body);
    console.log('Paystack webhook event:', event.event);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle successful payment
    if (event.event === 'charge.success' && event.data.status === 'success') {
      const { reference, amount, metadata } = event.data;
      const userId = metadata?.user_id;
      const plan = metadata?.plan || 'premium';

      if (!userId) {
        console.error('No user_id in webhook metadata');
        return new Response(JSON.stringify({ error: 'Missing user_id' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`Processing payment for user ${userId}, plan: ${plan}`);

      // Calculate subscription end date (30 days for monthly)
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      // Upsert subscription
      const { error: subError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          plan_type: plan,
          status: 'active',
          paystack_reference: reference,
          amount: amount / 100, // Convert from kobo to naira
          currency: 'NGN',
          end_date: endDate.toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (subError) {
        console.error('Error updating subscription:', subError);
        return new Response(JSON.stringify({ error: 'Database error' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Update profile subscription tier
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ subscription_tier: 'premium' })
        .eq('id', userId);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }

      console.log(`Successfully activated premium for user ${userId}`);
    }

    // Handle subscription cancellation
    if (event.event === 'subscription.disable') {
      const userId = event.data.metadata?.user_id;
      
      if (userId) {
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('user_id', userId);

        await supabase
          .from('profiles')
          .update({ subscription_tier: 'free' })
          .eq('id', userId);

        console.log(`Cancelled subscription for user ${userId}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
