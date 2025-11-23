import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { useAudioBgm } from "@/hooks/use-audio-bgm";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";

import { AuthProvider } from "@/contexts/AuthContext";
import { GameProvider, useGame } from "@/contexts/GameContext";
import { AuthGuard } from "@/components/AuthGuard";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Login } from "@/components/Login";
import { Signup } from "@/components/Signup";
import { StarterSelection } from "@/components/StarterSelection";
import { RegionMap } from "@/components/RegionMap";
import { ArenaSelection } from "@/components/ArenaSelection";
import { BattleScreen } from "@/components/BattleScreen";
import { Pokedex } from "@/components/Pokedex";
import { Badges } from "@/pages/Badges";
import { Leaderboard } from "@/components/Leaderboard";
import { MultiplayerGame } from "@/pages/MultiplayerGame";
import { BuddyDisplay } from "@/components/BuddyDisplay";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const queryClient = new QueryClient();

// Wrapper components
const LoginWrapper = () => {
  const navigate = useNavigate();
  return <Login onSwitchToSignup={() => navigate("/signup")} onLoginSuccess={() => navigate("/")} />;
};

const SignupWrapper = () => {
  const navigate = useNavigate();
  return <Signup onSwitchToLogin={() => navigate("/login")} onSignupSuccess={() => navigate("/login")} />;
};

const ArenaSelectionWrapper = () => {
  const navigate = useNavigate();
  return (
    <ArenaSelection
      onStartBattle={(gym, level) => {
        navigate("/battle", { state: { gym, level } });
      }}
      onBack={() => navigate("/regions")}
    />
  );
};

const BattleScreenWrapper = () => {
  const location = useLocation();
  const state = location.state as { gym: string; level: number | "leader" } | null;

  if (!state) return <Navigate to="/regions" />;

  return <BattleScreen gym={state.gym} level={state.level} />;
};

import { AnimatePresence, motion } from "framer-motion";

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
    className="w-full"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginWrapper /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><SignupWrapper /></PageTransition>} />
        <Route path="/starter" element={<PageTransition><AuthGuard><StarterSelection /></AuthGuard></PageTransition>} />
        <Route path="/regions" element={<PageTransition><AuthGuard><RegionMap /></AuthGuard></PageTransition>} />
        <Route path="/gyms" element={<PageTransition><AuthGuard><ArenaSelectionWrapper /></AuthGuard></PageTransition>} />
        <Route path="/battle" element={<PageTransition><AuthGuard><BattleScreenWrapper /></AuthGuard></PageTransition>} />
        <Route path="/pokedex" element={<PageTransition><AuthGuard><Pokedex /></AuthGuard></PageTransition>} />
        <Route path="/badges" element={<PageTransition><AuthGuard><Badges /></AuthGuard></PageTransition>} />
        <Route path="/leaderboard" element={<PageTransition><AuthGuard><Leaderboard /></AuthGuard></PageTransition>} />
        <Route path="/leaderboard" element={<PageTransition><AuthGuard><Leaderboard /></AuthGuard></PageTransition>} />
        <Route path="/multiplayer" element={<PageTransition><AuthGuard><MultiplayerGame /></AuthGuard></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
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

          {/* Global mute button - Styled to match theme */}
          <motion.button
            onClick={toggleMute}
            aria-label={muted ? "Unmute music" : "Mute music"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed top-4 right-4 z-50 p-3 rounded-xl bg-card/80 backdrop-blur-md border-2 border-primary/30 hover:border-primary shadow-lg hover:shadow-primary/20 transition-all duration-300 group"
          >
            {muted ? (
              <VolumeX className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            ) : (
              <Volume2 className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            )}
          </motion.button>

          <BrowserRouter>
            <AuthProvider>
              <GameProvider>
                <AnimatedRoutes />
                <ErrorBoundary>
                  <BuddyDisplay />
                </ErrorBoundary>
              </GameProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
