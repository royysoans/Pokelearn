import { PixelButton } from "./PixelButton";
import { ProfileCustomization } from "@/components/ProfileCustomization";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

export function HomePage() {
  const { setCurrentPage, gameState, isGameLoaded } = useGame();
  const { user, signOut } = useAuth();

  const handleStartJourney = () => {
    if (!isGameLoaded && user) return; // Prevent navigation while loading if logged in

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
    <div className="flex min-h-screen items-center justify-center p-4 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/Kanto.jpg')` }}>
      <div className="text-center animate-slide-in-up bg-black/50 p-8 rounded-lg backdrop-blur-sm w-full max-w-2xl">
        <h1 className="text-2xl sm:text-4xl md:text-6xl mb-6 text-primary text-shadow-pixel animate-bounce-slow">
          PokéLearn
        </h1>
        <p className="mb-8 text-sm sm:text-base md:text-xl text-white leading-relaxed max-w-sm sm:max-w-md mx-auto">
          Turn learning into an adventure!
        </p>
        {user ? (
          <div className="space-y-6">
            <p className="text-lg text-white">Welcome back, {user.user_metadata?.name || "Trainer"}!</p>

            <div className="flex flex-col gap-4 items-center">
              <PixelButton
                variant="primary"
                className="text-lg sm:text-xl md:text-2xl animate-pulse-glow w-full max-w-xs"
                onClick={handleStartJourney}
                disabled={!isGameLoaded}
              >
                {!isGameLoaded ? "Loading..." : "Continue Journey"}
              </PixelButton>

              <PixelButton
                variant="secondary"
                onClick={handleLogout}
                className="w-full max-w-xs"
              >
                Logout
              </PixelButton>

              <div className="pt-2">
                <ProfileCustomization />
              </div>
            </div>
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
