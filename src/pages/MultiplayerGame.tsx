import { useMultiplayer } from '@/hooks/useMultiplayer';
import { MultiplayerMenu } from '@/components/Multiplayer/MultiplayerMenu';
import { LobbyScreen } from '@/components/Multiplayer/LobbyScreen';
import { MultiplayerBattle } from '@/components/Multiplayer/MultiplayerBattle';
import { useGame } from '@/contexts/GameContext';

export function MultiplayerGame() {
    const { gameState, createLobby, joinLobby, submitAnswer, requestRematch, userId } = useMultiplayer();
    const { currentPokemon } = useGame(); // Get selected pokemon from global context

    if (gameState.status === 'waiting') {
        if (gameState.lobbyId) {
            return (
                <LobbyScreen
                    lobbyId={gameState.lobbyId}
                    isHost={gameState.isHost}
                    topic="Battle" // We should store topic in state too
                />
            );
        }
    }

    if (gameState.status === 'active' || gameState.status === 'finished') {
        return (
            <MultiplayerBattle
                gameState={gameState}
                onSubmitAnswer={submitAnswer}
                onRequestRematch={requestRematch}
                userId={userId || ''}
            />
        );
    }

    return (
        <MultiplayerMenu
            onCreateLobby={(topic) => createLobby(topic, currentPokemon)}
            onJoinLobby={(id) => joinLobby(id, currentPokemon)}
        />
    );
}
