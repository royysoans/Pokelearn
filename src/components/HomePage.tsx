import { PixelButton } from "./PixelButton";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";

export function HomePage() {
  const { setCurrentPage, gameState } = useGame();
  const { user, signOut } = useAuth();

  const handleStartJourney = () => {
    if (gameState.pokemon.length > 0) {
      setCurrentPage("regions");
    } else {
      setCurrentPage("starter");
    }
  };

  const handleLogin = () => {
    setCurrentPage("login");
  };

  const handleSignup = () => {
    setCurrentPage("signup");
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/src/assets/Kanto.jpg')" }}>
      <div className="text-center animate-slide-in-up bg-black/50 p-8 rounded-lg backdrop-blur-sm">
        <h1 className="text-2xl sm:text-4xl md:text-6xl mb-6 text-primary text-shadow-pixel animate-bounce-slow">
          PokéLearn
        </h1>
        <p className="mb-8 text-sm sm:text-base md:text-xl text-white leading-relaxed max-w-sm sm:max-w-md mx-auto">
          Turn learning into an adventure!
        </p>
        {user ? (
          <div className="space-y-4">
            <p className="text-lg text-white">Welcome back, {user.user_metadata?.name || "Trainer"}!</p>
            <PixelButton
              variant="primary"
              className="text-lg sm:text-xl md:text-2xl animate-pulse-glow"
              onClick={handleStartJourney}
            >
              Continue Journey
            </PixelButton>
            <br />
            <PixelButton
              variant="secondary"
              onClick={handleLogout}
            >
              Logout
            </PixelButton>
          </div>
        ) : (
          <div className="space-y-4">
            <PixelButton
              variant="primary"
              className="text-lg sm:text-xl md:text-2xl animate-pulse-glow"
              onClick={handleLogin}
            >
              Login
            </PixelButton>
            <br />
            <PixelButton
              variant="secondary"
              onClick={handleSignup}
            >
              Sign Up
            </PixelButton>
          </div>
        )}
      </div>
    </div>
  );
}
