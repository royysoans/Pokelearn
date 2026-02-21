import { useState, useMemo } from "react";
import { PixelButton } from "./PixelButton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FloatingOrb } from "./FloatingOrb";

interface LoginProps {
  onSwitchToSignup: () => void;
  onLoginSuccess?: () => void;
}

export function Login({ onSwitchToSignup, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }

    setLoading(false);
  };

  // Stabilize random orb values across re-renders to prevent CSS animation jumps
  const orbs = useMemo(() => {
    return [...Array(8)].map((_, i) => ({
      key: `orb - ${i} `,
      index: i,
      delay: i * 2,
      duration: 20 + Math.random() * 10,
      size: 100 + Math.random() * 150
    }));
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950 font-pixel relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Gradient Orbs */}
        {orbs.map(orb => (
          <FloatingOrb
            key={orb.key}
            index={orb.index}
            delay={orb.delay}
            duration={orb.duration}
            size={orb.size}
          />
        ))}
        {/* Interactive Orb */}
        <FloatingOrb followPointer size={300} />
      </div>

      <div className="w-full max-w-md space-y-6 bg-black/50 p-8 rounded-lg backdrop-blur-sm relative z-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary text-shadow-pixel mb-2">
            PokéLearn
          </h1>
          <h2 className="text-xl text-foreground/80">Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pixel-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pixel-input"
            />
          </div>

          <PixelButton
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </PixelButton>
        </form>

        <div className="text-center">
          <button
            onClick={onSwitchToSignup}
            className="text-sm text-primary hover:underline"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
