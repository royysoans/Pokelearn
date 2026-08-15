import { useState } from "react";
import { PixelButton } from "./PixelButton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


interface LoginProps {
  onSwitchToSignup: () => void;
  onLoginSuccess?: () => void;
}

export function Login({ onSwitchToSignup, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { signIn, resetPasswordForEmail } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isForgotPassword) {
      const { error } = await resetPasswordForEmail(email);
      if (error) {
        toast({
          title: "Reset Link Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Reset Link Sent!",
          description: "Check your email for a link to reset your password.",
        });
        setIsForgotPassword(false);
      }
    } else {
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
    }

    setLoading(false);
  };


  return (
    <div className="flex min-h-screen items-center justify-center p-4 font-pixel relative overflow-hidden">
      {/* Fixed background image layer */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0"
        style={{ backgroundImage: `url('/Kanto.jpg')` }}
      />

      <div className="w-full max-w-md space-y-6 bg-black/60 p-8 rounded-2xl backdrop-blur-md border-2 border-primary/30 shadow-2xl relative z-10">



        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary text-shadow-pixel mb-2">
            PokéLearn
          </h1>
          <h2 className="text-xl text-foreground/80">
            {isForgotPassword ? "Reset Password" : "Login"}
          </h2>
          {isForgotPassword && (
            <p className="text-xs text-muted-foreground mt-2">
              Enter your email address to receive a password reset link.
            </p>
          )}
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

          {!isForgotPassword && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pixel-input"
              />
            </div>
          )}

          <PixelButton
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? isForgotPassword ? "Sending Link..." : "Logging in..."
              : isForgotPassword ? "Send Reset Link" : "Login"}
          </PixelButton>
        </form>

        <div className="text-center space-y-2">
          {isForgotPassword ? (
            <button
              onClick={() => setIsForgotPassword(false)}
              className="text-sm text-primary hover:underline block w-full"
            >
              Back to Login
            </button>
          ) : (
            <button
              onClick={onSwitchToSignup}
              className="text-sm text-primary hover:underline"
            >
              Don't have an account? Sign up
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

