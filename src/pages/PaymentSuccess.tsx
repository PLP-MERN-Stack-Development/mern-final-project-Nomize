import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function PaymentSuccess() {
  useEffect(() => {
    const finalize = async () => {
      await supabase.auth.refreshSession();
      window.location.href = "/dashboard";
    };

    finalize();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-xl">
      Updating your account…
    </div>
  );
}
