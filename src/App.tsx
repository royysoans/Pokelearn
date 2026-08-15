// App Root
import { lazy, Suspense, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { useAudioBgm } from "@/hooks/use-audio-bgm";
import { useSound } from "@/hooks/use-sound";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { Volume2, VolumeX, SlidersHorizontal, Music, Volume1 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { AuthProvider } from "@/contexts/AuthContext";
import { GameProvider } from "@/contexts/GameContext";
import { AuthGuard } from "@/components/AuthGuard";
import { BuddyDisplay } from "@/components/BuddyDisplay";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy-loaded components for optimal bundle splitting
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("@/components/Login").then(m => ({ default: m.Login })));
const Signup = lazy(() => import("@/components/Signup").then(m => ({ default: m.Signup })));
const StarterSelection = lazy(() => import("@/components/StarterSelection").then(m => ({ default: m.StarterSelection })));
const RegionMap = lazy(() => import("@/components/RegionMap").then(m => ({ default: m.RegionMap })));
const ArenaSelection = lazy(() => import("@/components/ArenaSelection").then(m => ({ default: m.ArenaSelection })));
const BattleScreen = lazy(() => import("@/components/BattleScreen").then(m => ({ default: m.BattleScreen })));
const Pokedex = lazy(() => import("@/components/Pokedex").then(m => ({ default: m.Pokedex })));
const Badges = lazy(() => import("@/pages/Badges").then(m => ({ default: m.Badges })));
const Leaderboard = lazy(() => import("@/components/Leaderboard").then(m => ({ default: m.Leaderboard })));
const MasteryDashboard = lazy(() => import("@/components/MasteryDashboard").then(m => ({ default: m.MasteryDashboard })));
const AITrainingSetup = lazy(() => import("@/components/AITrainingSetup").then(m => ({ default: m.AITrainingSetup })));
const AITrainingBattle = lazy(() => import("@/components/AITrainingBattle").then(m => ({ default: m.AITrainingBattle })));
const MultiplayerGame = lazy(() => import("@/pages/MultiplayerGame").then(m => ({ default: m.MultiplayerGame })));

const queryClient = new QueryClient();

// Themed loading fallback spinner
const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin relative flex items-center justify-center">
      <div className="w-4 h-4 bg-primary rounded-full animate-ping" />
    </div>
    <p className="text-sm font-bold text-muted-foreground tracking-widest uppercase animate-pulse">Loading Pokémon Data...</p>
  </div>
);

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
    <Suspense fallback={<LoadingFallback />}>
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
          <Route path="/mastery" element={<PageTransition><AuthGuard><MasteryDashboard /></AuthGuard></PageTransition>} />
          <Route path="/ai-training" element={<PageTransition><AuthGuard><AITrainingSetup /></AuthGuard></PageTransition>} />
          <Route path="/ai-battle" element={<PageTransition><AuthGuard><AITrainingBattle /></AuthGuard></PageTransition>} />
          <Route path="/multiplayer" element={<PageTransition><AuthGuard><MultiplayerGame /></AuthGuard></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

const AudioControlsMenu = () => {
  const { muted, volume, toggleMute, setVolume } = useAudioBgm("/Pokemon Theme Song Instrumental~ - MK.mp3");
  const { getSfxVolume, setSfxVolume, isSfxMuted, setSfxMuted } = useSound();
  const [showSettings, setShowSettings] = useState(false);
  const [sfxVolState, setSfxVolState] = useState(() => getSfxVolume());
  const [sfxMutedState, setSfxMutedState] = useState(() => isSfxMuted());

  const handleSfxVolChange = (v: number) => {
    setSfxVolState(v);
    setSfxVolume(v);
    if (v > 0 && sfxMutedState) {
      setSfxMutedState(false);
      setSfxMuted(false);
    }
  };

  const handleSfxMuteToggle = () => {
    const next = !sfxMutedState;
    setSfxMutedState(next);
    setSfxMuted(next);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <motion.button
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Audio Settings"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-xl bg-card/80 backdrop-blur-md border-2 border-primary/30 hover:border-primary shadow-lg transition-all"
        >
          <SlidersHorizontal className="w-5 h-5 text-primary" />
        </motion.button>

        <motion.button
          onClick={toggleMute}
          aria-label={muted ? "Unmute music" : "Mute music"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-xl bg-card/80 backdrop-blur-md border-2 border-primary/30 hover:border-primary shadow-lg transition-all group"
        >
          {muted ? (
            <VolumeX className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          ) : (
            <Volume2 className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="w-64 p-4 rounded-xl bg-card/90 backdrop-blur-md border-2 border-primary/40 shadow-2xl space-y-4 text-xs font-bold"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center text-primary">
                <span className="flex items-center gap-1.5"><Music className="w-4 h-4" /> BGM Volume</span>
                <span>{muted ? "Muted" : `${Math.round(volume * 100)}%`}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-primary">
                <span className="flex items-center gap-1.5"><Volume1 className="w-4 h-4" /> SFX Volume</span>
                <span>{sfxMutedState ? "Muted" : `${Math.round(sfxVolState * 100)}%`}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sfxMutedState ? 0 : sfxVolState}
                  onChange={(e) => handleSfxVolChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <button
                  onClick={handleSfxMuteToggle}
                  className="text-xs text-muted-foreground hover:text-primary underline"
                >
                  {sfxMutedState ? "Unmute" : "Mute"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <AudioControlsMenu />

          <BrowserRouter>
            <AuthProvider>
              <GameProvider>
                <ErrorBoundary>
                  <BuddyDisplay />
                  <AnimatedRoutes />
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

