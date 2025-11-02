import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useSupabaseSession() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      console.log("Current user session:", data.session?.user);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log("Session changed:", session?.user);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return session;
}
