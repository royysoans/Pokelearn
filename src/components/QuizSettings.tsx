import { useState } from "react";
import { Settings, Type, TextCursorInput } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizSettingsProps {
    fontSize: "sm" | "base" | "lg" | "xl";
    fontFamily: "normal" | "noto";
    onFontSizeChange: (size: "sm" | "base" | "lg" | "xl") => void;
    onFontFamilyChange: (family: "normal" | "noto") => void;
}

export function QuizSettings({
    fontSize,
    fontFamily,
    onFontSizeChange,
    onFontFamilyChange,
}: QuizSettingsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const fontSizeLabels = {
        sm: "Small",
        base: "Medium",
        lg: "Large",
        xl: "Extra Large",
    };

    return (
        <div className="relative">
            {/* Settings Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg bg-card/80 border-2 border-border hover:bg-card transition-colors"
                aria-label="Quiz Settings"
            >
                <Settings className="w-5 h-5" />
            </button>

            {/* Settings Popup */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Settings Panel */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-72 bg-card border-2 border-border rounded-xl p-4 shadow-2xl z-50"
                        >
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Quiz Settings
                            </h3>

                            {/* Font Size */}
                            <div className="mb-4">
                                <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <TextCursorInput className="w-4 h-4" />
                                    Font Size
                                </label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {(Object.keys(fontSizeLabels) as Array<keyof typeof fontSizeLabels>).map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => onFontSizeChange(size)}
                                            className={`px-3 py-2 rounded-lg border-2 transition-all ${fontSize === size
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-background border-border hover:border-primary/50"
                                                }`}
                                        >
                                            {fontSizeLabels[size]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Font Family */}
                            <div>
                                <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                                    <Type className="w-4 h-4" />
                                    Font Type
                                </label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <button
                                        onClick={() => onFontFamilyChange("normal")}
                                        className={`px-3 py-2 rounded-lg border-2 transition-all ${fontFamily === "normal"
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-background border-border hover:border-primary/50"
                                            }`}
                                    >
                                        Normal
                                    </button>
                                    <button
                                        onClick={() => onFontFamilyChange("noto")}
                                        className={`px-3 py-2 rounded-lg border-2 transition-all font-noto ${fontFamily === "noto"
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-background border-border hover:border-primary/50"
                                            }`}
                                    >
                                        OpenDyslexic
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 mb-4">
                                    OpenDyslexic font is designed for better readability
                                </p>
                            </div>

                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
