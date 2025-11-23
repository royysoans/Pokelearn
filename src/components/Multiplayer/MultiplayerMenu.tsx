import { useState } from 'react';
import { useMultiplayer } from '@/hooks/useMultiplayer';
import { PixelButton } from '@/components/PixelButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MultiplayerMenuProps {
    onJoinLobby: (lobbyId: string) => void;
    onCreateLobby: (topic: string) => void;
}

export function MultiplayerMenu({ onJoinLobby, onCreateLobby }: MultiplayerMenuProps) {
    const [topic, setTopic] = useState('');
    const [lobbyIdToJoin, setLobbyIdToJoin] = useState('');

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
            <h2 className="text-3xl font-bold text-primary text-shadow-pixel">Multiplayer Battle</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Create Lobby */}
                <Card className="bg-card/90 border-4 border-primary">
                    <CardHeader>
                        <CardTitle className="text-xl text-center">Create Lobby</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="topic">Battle Topic</Label>
                            <Input
                                id="topic"
                                placeholder="e.g. React Hooks, Pokemon Gen 1"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="font-pixel"
                            />
                        </div>
                        <PixelButton
                            onClick={() => onCreateLobby(topic)}
                            disabled={!topic}
                            className="w-full"
                        >
                            Create & Host
                        </PixelButton>
                    </CardContent>
                </Card>

                {/* Join Lobby */}
                <Card className="bg-card/90 border-4 border-secondary">
                    <CardHeader>
                        <CardTitle className="text-xl text-center">Join Lobby</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="lobbyId">Lobby ID</Label>
                            <Input
                                id="lobbyId"
                                placeholder="Enter Lobby ID"
                                value={lobbyIdToJoin}
                                onChange={(e) => setLobbyIdToJoin(e.target.value)}
                                className="font-pixel"
                            />
                        </div>
                        <PixelButton
                            onClick={() => onJoinLobby(lobbyIdToJoin)}
                            disabled={!lobbyIdToJoin}
                            className="w-full"
                            variant="secondary"
                        >
                            Join Battle
                        </PixelButton>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
