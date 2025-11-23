import { useState } from 'react';
import { motion } from 'framer-motion';
import { PixelButton } from '@/components/PixelButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Swords, Users, Crown, Gamepad2, Zap } from 'lucide-react';

interface MultiplayerMenuProps {
    onJoinLobby: (lobbyId: string) => void;
    onCreateLobby: (topic: string) => void;
}

export function MultiplayerMenu({ onJoinLobby, onCreateLobby }: MultiplayerMenuProps) {
    const [topic, setTopic] = useState('');
    const [lobbyIdToJoin, setLobbyIdToJoin] = useState('');
    const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);

    return (
        <div className="relative w-full min-h-screen flex flex-col md:flex-row overflow-hidden bg-black">

            {/* VS Badge - Absolute Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 md:w-32 md:h-32 bg-yellow-400 rounded-full border-4 border-black flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.6)]"
                >
                    <span className="text-4xl md:text-6xl font-black italic text-black font-pixel">VS</span>
                </motion.div>
            </div>

            {/* Left Side - Create Lobby (Host) */}
            <motion.div
                className="relative flex-1 flex flex-col items-center justify-center p-8 border-b-4 md:border-b-0 md:border-r-4 border-black group"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                onMouseEnter={() => setHoveredSide('left')}
                onMouseLeave={() => setHoveredSide(null)}
                style={{
                    backgroundImage: `linear-gradient(rgba(220, 38, 38, 0.8), rgba(153, 27, 27, 0.9)), url('/Kanto.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

                <div className="relative z-10 w-full max-w-md space-y-8 text-center">
                    <motion.div
                        animate={{ y: hoveredSide === 'left' ? -10 : 0 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-20 h-20 bg-red-500 rounded-full border-4 border-white flex items-center justify-center mb-4 shadow-lg">
                            <Crown className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white text-shadow-pixel mb-2">HOST</h2>
                        <p className="text-red-100 text-lg">Create a battle arena</p>
                    </motion.div>

                    <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border-2 border-red-400/50 space-y-4">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="topic" className="text-red-200">Battle Topic</Label>
                            <div className="relative">
                                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                                <Input
                                    id="topic"
                                    placeholder="e.g. React Hooks"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="pl-10 font-pixel bg-black/50 border-red-400/30 text-white placeholder:text-white/30 focus:border-red-400"
                                />
                            </div>
                        </div>
                        <PixelButton
                            onClick={() => onCreateLobby(topic)}
                            disabled={!topic}
                            className="w-full text-lg py-6"
                            variant="primary"
                        >
                            Create Lobby
                        </PixelButton>
                    </div>
                </div>
            </motion.div>

            {/* Right Side - Join Lobby (Challenger) */}
            <motion.div
                className="relative flex-1 flex flex-col items-center justify-center p-8 group"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onMouseEnter={() => setHoveredSide('right')}
                onMouseLeave={() => setHoveredSide(null)}
                style={{
                    backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.8), rgba(30, 64, 175, 0.9)), url('/bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

                <div className="relative z-10 w-full max-w-md space-y-8 text-center">
                    <motion.div
                        animate={{ y: hoveredSide === 'right' ? -10 : 0 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-20 h-20 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center mb-4 shadow-lg">
                            <Swords className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white text-shadow-pixel mb-2">JOIN</h2>
                        <p className="text-blue-100 text-lg">Enter an existing arena</p>
                    </motion.div>

                    <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border-2 border-blue-400/50 space-y-4">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="lobbyId" className="text-blue-200">Lobby ID</Label>
                            <div className="relative">
                                <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                                <Input
                                    id="lobbyId"
                                    placeholder="Enter Code"
                                    value={lobbyIdToJoin}
                                    onChange={(e) => setLobbyIdToJoin(e.target.value)}
                                    className="pl-10 font-pixel bg-black/50 border-blue-400/30 text-white placeholder:text-white/30 focus:border-blue-400"
                                />
                            </div>
                        </div>
                        <PixelButton
                            onClick={() => onJoinLobby(lobbyIdToJoin)}
                            disabled={!lobbyIdToJoin}
                            className="w-full text-lg py-6"
                            variant="secondary"
                        >
                            Join Battle
                        </PixelButton>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
