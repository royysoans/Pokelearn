import { useGame } from "@/contexts/GameContext";
import { PixelButton } from "./PixelButton";
import { useMemo } from "react";
import { motion } from "framer-motion";

export function MasteryDashboard() {
    const { gameState, setCurrentPage } = useGame();
    const subjects = ["math", "science", "coding"];

    // Calculate mastery
    const masteryStats = useMemo(() => {
        const stats: Record<string, { totalLevels: number }> = {
            math: { totalLevels: 0 },
            science: { totalLevels: 0 },
            coding: { totalLevels: 0 }
        };

        Object.values(gameState.completedLevels).forEach(regionData => {
            subjects.forEach(sub => {
                const levelsCompleted = regionData[sub]?.length || 0;
                stats[sub].totalLevels += levelsCompleted;
            });
        });
        return stats;
    }, [gameState.completedLevels]);

    const maxTotalLevels = 8 * 10; // 8 regions * 10 levels

    const getRegionImage = (region: string) => {
        switch (region) {
            case "Kanto": return "/kanto_bag.png";
            case "Johto": return "/jhoto_bag.png";
            case "Hoenn": return "/hoenn_bag.png";
            case "Sinnoh": return "/sinnoh_bag.png";
            case "Unova": return "/unova_bag.png";
            case "Kalos": return "/kalos_bag.png";
            case "Alola": return "/alola_bag.png";
            case "Galar": return "/galar_bag.png";
            default: return "";
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background p-4 sm:p-6 pb-20 relative overflow-hidden">
            {/* Background elements for premium feel */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-electric/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-5xl mx-auto w-full relative z-10">
                <div className="flex justify-between items-center mb-8 bg-card/50 backdrop-blur border-b-4 border-primary p-4 rounded-xl">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl text-primary font-bold text-shadow-pixel flex items-center">
                        <span className="text-3xl lg:text-4xl mr-3 animate-bounce-slow">🎓</span>
                        Mastery Hub
                    </h2>
                    <PixelButton onClick={() => setCurrentPage("home")} variant="secondary">
                        Back to Home
                    </PixelButton>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12"
                >
                    {subjects.map(subject => {
                        const completed = masteryStats[subject].totalLevels;
                        const percentage = Math.round((completed / maxTotalLevels) * 100);

                        let color = "bg-primary";
                        let border = "border-primary";
                        let text = "text-primary";
                        let emoji = "🧠";
                        let label = "General";

                        if (subject === "math") {
                            color = "bg-electric";
                            border = "border-electric";
                            text = "text-electric";
                            emoji = "📐";
                            label = "Mathematics";
                        } else if (subject === "science") {
                            color = "bg-grass";
                            border = "border-grass";
                            text = "text-grass";
                            emoji = "🔬";
                            label = "Science";
                        } else if (subject === "coding") {
                            color = "bg-water";
                            border = "border-water";
                            text = "text-water";
                            emoji = "💻";
                            label = "Coding";
                        }

                        return (
                            <motion.div
                                variants={itemVariants as any}
                                key={subject}
                                className={`bg-card/80 backdrop-blur border-4 ${border} rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group`}
                            >
                                <div className={`absolute -right-6 -top-6 text-8xl opacity-10 group-hover:scale-110 transition-transform duration-500`}>
                                    {emoji}
                                </div>
                                <div className="relative z-10">
                                    <h3 className={`text-xl font-bold mb-6 flex items-center ${text} uppercase tracking-wider`}>
                                        <span className="mr-3 text-2xl">{emoji}</span> {label}
                                    </h3>

                                    <div className="flex justify-between items-end mb-3">
                                        <span className={`text-4xl font-black ${text}`}>{percentage}%</span>
                                        <span className="text-muted-foreground font-bold">{completed} <span className="text-xs">/ {maxTotalLevels} LVL</span></span>
                                    </div>

                                    <div className={`h-6 w-full rounded-full bg-background overflow-hidden border-2 ${border} relative`}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" } as any}
                                            className={`h-full ${color} opacity-80`}
                                        />
                                        {/* Segment markers for 10% blocks */}
                                        <div className="absolute inset-0 flex">
                                            {[...Array(10)].map((_, i) => (
                                                <div key={i} className={`flex-1 border-r border-background/50 last:border-0`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="mt-4 text-xs font-bold text-muted-foreground uppercase text-center tracking-widest">
                                        {percentage === 0 ? "Untested" :
                                            percentage < 30 ? "Beginner" :
                                                percentage < 70 ? "Advanced" :
                                                    percentage < 100 ? "Expert" :
                                                        "Master"}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-1 flex-1 bg-gradient-to-r from-transparent to-border" />
                        <h3 className="text-2xl font-bold text-shadow-pixel tracking-widest uppercase">World Completion</h3>
                        <div className="h-1 flex-1 bg-gradient-to-l from-transparent to-border" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar"].map((region, idx) => {
                            const math = gameState.completedLevels[region]?.["math"]?.length || 0;
                            const science = gameState.completedLevels[region]?.["science"]?.length || 0;
                            const coding = gameState.completedLevels[region]?.["coding"]?.length || 0;

                            const total = math + science + coding;
                            const hasVisited = total > 0;
                            const bgImage = getRegionImage(region);

                            return (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + (idx * 0.1) }}
                                    key={region}
                                    className={`relative h-48 rounded-xl overflow-hidden border-4 transition-all duration-300 ${hasVisited ? 'border-primary cursor-pointer hover:shadow-primary/50 hover:shadow-2xl hover:-translate-y-2' : 'border-border grayscale opacity-60'}`}
                                >
                                    {/* Region Image Background */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110"
                                        style={{
                                            backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                                            backgroundColor: bgImage ? 'transparent' : '#1f2937'
                                        }}
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                        <h4 className="text-xl font-bold text-white font-pixel mb-3 drop-shadow-md">
                                            {region} {hasVisited ? "" : "????"}
                                        </h4>
                                        {hasVisited ? (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 text-xs font-bold text-electric">Math</div>
                                                    <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden">
                                                        <div className="h-full bg-electric" style={{ width: `${(math / 10) * 100}%` }} />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 text-xs font-bold text-grass">Science</div>
                                                    <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden">
                                                        <div className="h-full bg-grass" style={{ width: `${(science / 10) * 100}%` }} />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 text-xs font-bold text-water">Coding</div>
                                                    <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden">
                                                        <div className="h-full bg-water" style={{ width: `${(coding / 10) * 100}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground text-xs italic">Undiscovered Territory</p>
                                        )}
                                    </div>

                                    {/* Completion Badge */}
                                    {total === 30 && (
                                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-lg transform rotate-12 border-2 border-yellow-600">
                                            100%
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
