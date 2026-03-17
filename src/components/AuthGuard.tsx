import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { isSupabaseConfigured } from "@/integrations/supabase/client";

interface AuthGuardProps {
  children?: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Setup Required</h1>
          <p className="mb-4">
            Supabase is not configured. Please set up your Supabase project and add the environment variables.
          </p>
          <div className="text-left bg-muted p-4 rounded text-sm">
            <p>1. Create a Supabase project at <a href="https://supabase.com" className="text-primary underline">supabase.com</a></p>
            <p>2. Get your project URL and anon key</p>
            <p>3. Create a <code>.env.local</code> file in the project root with:</p>
            <pre className="mt-2">
              VITE_SUPABASE_URL=your_project_url<br />
              VITE_SUPABASE_ANON_KEY=your_anon_key
            </pre>
            <p>4. Run <code>supabase db reset</code> to apply migrations</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
