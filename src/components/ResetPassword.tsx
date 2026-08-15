import { useState } from "react";
import { PixelButton } from "./PixelButton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";


export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);

    if (error) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password Updated!",
        description: "Your password has been changed successfully. Please log in with your new password.",
      });
      navigate("/login");
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
          <h2 className="text-xl text-foreground/80">Set New Password</h2>
          <p className="text-xs text-muted-foreground mt-2">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="pixel-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="pixel-input"
            />
          </div>

          <PixelButton
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </PixelButton>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-primary hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
