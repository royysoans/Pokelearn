import { useState, useEffect, useRef } from 'react';
import { PixelButton } from '@/components/PixelButton';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/use-sound';
import { GameState } from '@/hooks/useMultiplayer';

interface MultiplayerBattleProps {
    gameState: GameState;
    onSubmitAnswer: (isCorrect: boolean) => void;
    onRequestRematch: () => void;
    onExitGame: () => void;
    userId: string;
}

export function MultiplayerBattle({ gameState, onSubmitAnswer, onRequestRematch, onExitGame, userId }: MultiplayerBattleProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const { playCorrect, playWrong, playVictory } = useSound();

    const questions = gameState.questions || [];
    const currentQuestion = questions[gameState.currentQuestionIndex];

    // Reset local state when question changes
    useEffect(() => {
        setSelectedOption(null);
        setShowResult(false);
        setIsCorrect(false);
    }, [gameState.currentQuestionIndex]);

    // Play sounds based on last result
    useEffect(() => {
        if (gameState.lastResult === 'correct') {
            playCorrect();
        } else if (gameState.lastResult === 'wrong') {
            playWrong();
        }
    }, [gameState.lastResult, playCorrect, playWrong]);

    const handleOptionClick = (option: string) => {
        if (showResult) return; // Prevent multiple clicks

        setSelectedOption(option);
        const correct = option === currentQuestion.c;
        setIsCorrect(correct);
        setShowResult(true);

        // Submit immediately
        onSubmitAnswer(correct);
    };

    // Shake effect state
    const [shake, setShake] = useState(false);
    const [attackAnim, setAttackAnim] = useState<'left' | 'right' | null>(null);

    // Trigger shake and attack animation on damage
    useEffect(() => {
        // We need to detect WHO took damage to animate correctly
        // This is a bit tricky with just state snapshots, but we can infer from HP changes if we tracked previous HP
        // For now, let's just animate based on low HP or generic damage
        if (gameState.myHp < 10 || gameState.opponentHp < 10) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    }, [gameState.myHp, gameState.opponentHp]);

    const victoryPlayedRef = useRef(false);

    useEffect(() => {
        if ((gameState.status === 'finished' || gameState.winner) && gameState.winner === userId && !victoryPlayedRef.current) {
            playVictory();
            victoryPlayedRef.current = true;
        }
    }, [gameState.status, gameState.winner, userId, playVictory]);

    if (gameState.status === 'finished' || gameState.winner) {
        const iWon = gameState.winner === userId;

        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-1000">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="text-center space-y-8 p-12 bg-card/90 border-4 border-primary rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                    <h1 className={`text-8xl font-bold text-shadow-pixel mb-4 ${iWon ? "text-yellow-400" : "text-red-500"}`}>
                        {iWon ? "VICTORY!" : "DEFEAT"}
                    </h1>
                    <div className="text-9xl animate-bounce">
                        {iWon ? "🏆" : "💀"}
                    </div>
                    <p className="text-3xl text-muted-foreground font-pixel">
                        {iWon ? "You are the Pokémon Master!" : "Better luck next time..."}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <PixelButton
                            onClick={onRequestRematch}
                            className="text-2xl px-12 py-6"
                        >
                            Rematch
                        </PixelButton>
                        <PixelButton
                            onClick={onExitGame}
                            variant="secondary"
                            className="text-2xl px-12 py-6"
                        >
                            Exit
                        </PixelButton>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!currentQuestion) {
        if (gameState.questions.length > 0 && gameState.currentQuestionIndex >= gameState.questions.length) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h2 className="text-2xl font-bold mb-4">Battle Ended!</h2>
                    <p>Waiting for results...</p>
                </div>
            );
        }
        return (
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xl font-pixel animate-pulse">Preparing Battle Arena...</p>
            </div>
        );
    }

    return (
        <div className={`w-full h-screen bg-slate-900 p-4 flex flex-col items-center justify-center space-y-4 overflow-hidden ${shake ? 'animate-shake' : ''}`}>

            {/* Too Slow Overlay */}
            <AnimatePresence>
                {gameState.lastResult === 'too_slow' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <h1 className="text-8xl font-black text-red-600 text-shadow-lg -rotate-12 border-4 border-white p-4 bg-black/50 backdrop-blur-sm rounded-xl">
                            TOO SLOW!
                        </h1>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* VS Header */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="text-4xl font-black text-white italic tracking-tighter text-shadow-lg bg-red-600 px-3 py-1 transform -skew-x-12 border-2 border-white">
                    VS
                </div>
            </div>

            {/* Battle Arena */}
            <div className="w-full max-w-5xl grid grid-cols-2 gap-8 items-center relative flex-1 max-h-[40vh]">

                {/* Player Zone (Left) */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-slate-800/50 p-4 rounded-xl border-2 border-blue-500 backdrop-blur-sm h-full flex flex-col justify-center relative"
                >
                    <div className="flex flex-col space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-xl font-bold text-blue-400">YOU</span>
                            <span className="text-lg text-white font-mono">{gameState.myHp}/10 HP</span>
                        </div>
                        {/* Segmented Health Bar */}
                        <div className="flex gap-0.5 h-4">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-[1px] transition-all duration-300 ${i < gameState.myHp
                                        ? 'bg-gradient-to-b from-green-400 to-green-600 shadow-[0_0_5px_rgba(34,197,94,0.5)]'
                                        : 'bg-slate-700'
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="h-32 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700 relative overflow-hidden group">
                            <div className="w-20 h-20 bg-blue-500 rounded-full animate-bounce shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                            {/* Damage Float */}
                            <AnimatePresence>
                                {shake && gameState.myHp < 10 && (
                                    <motion.div
                                        initial={{ opacity: 1, y: 0, scale: 0.5 }}
                                        animate={{ opacity: 0, y: -50, scale: 1.5 }}
                                        className="absolute text-4xl font-black text-red-500 stroke-white stroke-2"
                                    >
                                        -1
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* Opponent Zone (Right) */}
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-slate-800/50 p-4 rounded-xl border-2 border-red-500 backdrop-blur-sm h-full flex flex-col justify-center relative"
                >
                    <div className="flex flex-col space-y-2 text-right">
                        <div className="flex justify-between items-end flex-row-reverse">
                            <span className="text-xl font-bold text-red-400">OPPONENT</span>
                            <span className="text-lg text-white font-mono">{gameState.opponentHp}/10 HP</span>
                        </div>
                        {/* Segmented Health Bar */}
                        <div className="flex gap-0.5 h-4 flex-row-reverse">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-[1px] transition-all duration-300 ${i < gameState.opponentHp
                                        ? 'bg-gradient-to-b from-red-400 to-red-600 shadow-[0_0_5px_rgba(239,68,68,0.5)]'
                                        : 'bg-slate-700'
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="h-32 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700 relative overflow-hidden">
                            <div className="w-20 h-20 bg-red-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]"></div>
                            {/* Damage Float */}
                            <AnimatePresence>
                                {shake && gameState.opponentHp < 10 && (
                                    <motion.div
                                        initial={{ opacity: 1, y: 0, scale: 0.5 }}
                                        animate={{ opacity: 0, y: -50, scale: 1.5 }}
                                        className="absolute text-4xl font-black text-yellow-400 stroke-white stroke-2"
                                    >
                                        HIT!
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Question Card */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-w-4xl flex-1 max-h-[50vh]"
            >
                <Card className="border-2 border-yellow-400 bg-slate-800/95 shadow-xl overflow-hidden h-full flex flex-col">
                    <div className="h-1 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 animate-gradient-x shrink-0"></div>
                    <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-center">
                        <div className="text-center space-y-2 shrink-0">
                            <h3 className="text-lg font-bold text-yellow-400 tracking-widest uppercase animate-pulse">
                                RACE! Answer First!
                            </h3>
                            <p className="text-xl md:text-2xl font-bold text-white leading-tight drop-shadow-md">
                                {currentQuestion.q}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 content-center">
                            {currentQuestion.a.map((option: string, idx: number) => (
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    key={option}
                                    onClick={() => handleOptionClick(option)}
                                    disabled={showResult}
                                    className={`
                                        relative overflow-hidden p-3 text-base font-bold text-left rounded-lg border-2 transition-all duration-200 h-full flex items-center
                                        ${showResult && option === currentQuestion.c
                                            ? "bg-green-500 border-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.6)]"
                                            : showResult && option === selectedOption && !isCorrect
                                                ? "bg-red-500 border-red-400 text-white"
                                                : "bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 hover:border-yellow-400 hover:text-white hover:shadow-md"
                                        }
                                    `}
                                >
                                    <span className="opacity-50 mr-3 text-lg shrink-0">
                                        {['A', 'B', 'C', 'D'][idx]}.
                                    </span>
                                    <span className="line-clamp-2">{option}</span>
                                </motion.button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
