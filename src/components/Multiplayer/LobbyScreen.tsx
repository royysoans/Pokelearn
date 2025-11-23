import { useEffect, useState } from 'react';
import { PixelButton } from '@/components/PixelButton';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface LobbyScreenProps {
    lobbyId: string;
    isHost: boolean;
    topic: string;
}

export function LobbyScreen({ lobbyId, isHost, topic }: LobbyScreenProps) {
    const [copied, setCopied] = useState(false);

    const copyLobbyId = () => {
        navigator.clipboard.writeText(lobbyId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 text-center">
            <h2 className="text-3xl font-bold text-primary text-shadow-pixel">Lobby: {topic}</h2>

            <div className="bg-card/90 p-8 rounded-lg border-4 border-primary max-w-md w-full space-y-6">
                <div className="space-y-2">
                    <p className="text-muted-foreground">Lobby ID:</p>
                    <div className="flex items-center justify-center space-x-2">
                        <code className="bg-black/20 p-2 rounded font-mono text-lg">{lobbyId}</code>
                        <PixelButton onClick={copyLobbyId} className="h-8 px-3 text-xs">
                            {copied ? 'Copied!' : 'Copy'}
                        </PixelButton>
                    </div>
                </div>

                <div className="py-8">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
                    <p className="text-xl">
                        {isHost ? 'Waiting for opponent to join...' : 'Waiting for host to start...'}
                    </p>
                </div>

                <div className="text-sm text-muted-foreground">
                    <p>Share the Lobby ID with a friend to start the battle!</p>
                </div>
            </div>
        </div>
    );
}
