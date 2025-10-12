// src/App.tsx
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { useAudioBgm } from "@/hooks/use-audio-bgm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // debug: show Vite envs in console (remove when done)
  useEffect(() => {
    console.log("VITE_SUPABASE_URL =", import.meta.env.VITE_SUPABASE_URL);
    console.log(
      "VITE_SUPABASE_ANON_KEY present?",
      !!import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    console.log("VITE_FUNCTIONS_URL =", import.meta.env.VITE_FUNCTIONS_URL);
  }, []);

  // Use your public MP3; filename added in public folder
  const { muted, toggleMute } = useAudioBgm(
    "/Pokemon Theme Song Instrumental~ - MK.mp3"
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {/* Global mute button */}
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute music" : "Mute music"}
            className="fixed top-3 right-3 z-50 rounded-md border px-3 py-1 text-sm bg-background/70 backdrop-blur hover:bg-background"
          >
            {muted ? "🔇" : "🔊"}
          </button>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
