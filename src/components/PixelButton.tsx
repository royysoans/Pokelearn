import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "fire" | "water" | "grass" | "electric";
}

export function PixelButton({ variant = "primary", className, children, ...props }: PixelButtonProps) {
  const baseClasses = "btn-pixel px-6 py-3 text-sm uppercase font-bold border-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-primary text-primary-foreground border-yellow-600 hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground border-red-700 hover:bg-secondary/90",
    success: "bg-green-500 text-white border-green-700 hover:bg-green-600",
    fire: "bg-orange-500 text-white border-orange-700 hover:bg-orange-600",
    water: "bg-blue-500 text-white border-blue-700 hover:bg-blue-600",
    grass: "bg-green-600 text-white border-green-800 hover:bg-green-700",
    electric: "bg-yellow-400 text-gray-900 border-yellow-600 hover:bg-yellow-500",
  };

  return (
    <button className={cn(baseClasses, variantClasses[variant], className)} {...props}>
      {children}
    </button>
  );
}
