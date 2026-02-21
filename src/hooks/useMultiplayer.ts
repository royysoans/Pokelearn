import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateQuestions } from '@/data/questions';

export interface Player {
    id: string;
    pokemon: any;
    hp: number;
}

export interface GameState {
    lobbyId: string | null;
    battleId: string | null;
    isHost: boolean;
    opponent: Player | null;
    questions: any[];
    currentQuestionIndex: number;
    myHp: number;
    opponentHp: number;
    currentTurn: string | null;
    status: 'waiting' | 'active' | 'finished';
    winner: string | null;
    lastResult: 'correct' | 'wrong' | 'too_slow' | null;
}

export const useMultiplayer = () => {
    const [gameState, setGameState] = useState<GameState>({
        lobbyId: null,
        battleId: null,
        isHost: false,
        opponent: null,
        questions: [],
        currentQuestionIndex: 0,
        myHp: 10, // Default HP 10
        opponentHp: 10, // Default HP 10
        currentTurn: null,
        status: 'waiting',
        winner: null,
        lastResult: null,
    });

    const enterBattle = (battle: any) => {
        setGameState(prev => {
            const myPlayerId = userId;
            const opponentPlayerId = myPlayerId === battle.player_1_id ? battle.player_2_id : battle.player_1_id;

            const myPokemon = myPlayerId === battle.player_1_id ? battle.player_1_pokemon : battle.player_2_pokemon;
            const opponentPokemon = myPlayerId === battle.player_1_id ? battle.player_2_pokemon : battle.player_1_pokemon;

            const myHp = myPlayerId === battle.player_1_id ? battle.player_1_hp : battle.player_2_hp;
            const opponentHp = myPlayerId === battle.player_1_id ? battle.player_2_hp : battle.player_1_hp;

            return {
                ...prev,
                battleId: battle.id,
                questions: battle.questions,
                currentQuestionIndex: battle.current_question_index,
                myHp: myHp,
                opponentHp: opponentHp,
                currentTurn: battle.current_turn,
                status: battle.winner_id ? 'finished' : 'active',
                winner: battle.winner_id,
                opponent: {
                    id: opponentPlayerId,
                    pokemon: opponentPokemon,
                    hp: opponentHp,
                }
            };
        });

        subscribeToBattle(battle.id);
    };

    const subscribeToBattle = (battleId: string) => {
        const channel = supabase
            .channel(`battle:${battleId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'battles', filter: `id=eq.${battleId}` },
                (payload) => {
                    const battle = payload.new as any;
                    setGameState(prev => {
                        const myPlayerId = userId;
                        // const opponentPlayerId = myPlayerId === battle.player_1_id ? battle.player_2_id : battle.player_1_id;

                        const myHp = myPlayerId === battle.player_1_id ? battle.player_1_hp : battle.player_2_hp;
                        const opponentHp = myPlayerId === battle.player_1_id ? battle.player_2_hp : battle.player_1_hp;

                        return {
                            ...prev,
                            questions: battle.questions,
                            currentQuestionIndex: battle.current_question_index,
                            myHp: myHp,
                            opponentHp: opponentHp,
                            currentTurn: battle.current_turn,
                            status: battle.winner_id ? 'finished' : 'active',
                            winner: battle.winner_id,
                        };
                    });
                });

        activeChannelsRef.current.push(channel);
        channel.subscribe();
    };

    const submitAnswer = async (isCorrect: boolean) => {
        if (!gameState.battleId || !userId) return;

        // Call RPC to handle race conditions and secure updates
        const { data, error } = await supabase.rpc('submit_battle_answer', {
            p_battle_id: gameState.battleId,
            p_player_id: userId,
            p_current_question_index: gameState.currentQuestionIndex,
            p_is_correct: isCorrect
        });

        if (error) {
            console.error("Error submitting answer:", error);
            return;
        }

        if (data && data.status === 'too_slow') {
            setGameState(prev => ({ ...prev, lastResult: 'too_slow' }));
            // Clear the message after a delay
            setTimeout(() => {
                setGameState(prev => ({ ...prev, lastResult: null }));
            }, 2000);
        } else if (data && data.status === 'correct') {
            setGameState(prev => ({ ...prev, lastResult: 'correct' }));
            setTimeout(() => {
                setGameState(prev => ({ ...prev, lastResult: null }));
            }, 1000);
        } else if (data && data.status === 'wrong') {
            setGameState(prev => ({ ...prev, lastResult: 'wrong' }));
            setTimeout(() => {
                setGameState(prev => ({ ...prev, lastResult: null }));
            }, 1000);
        }
    };

    const requestRematch = async () => {
        if (!gameState.lobbyId) return;
        // Reset lobby status to waiting to trigger new game flow
        // Ideally we'd have a specific 'rematch' flow, but reusing lobby logic is simplest
        await supabase
            .from('lobbies')
            .update({ status: 'waiting', player_1_id: userId, player_2_id: null }) // Resetting lobby effectively
            .eq('id', gameState.lobbyId);

        // Actually, a better way for rematch in this current architecture:
        // Both players stay in lobby. Host triggers new game.
        // For now, let's just reload the page or reset state to 'waiting'
        window.location.reload();
    };

    const [userId, setUserId] = useState<string | null>(null);
    const gameStateRef = useRef(gameState);
    const activeChannelsRef = useRef<any[]>([]);

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    // Cleanup subscriptions on unmount
    useEffect(() => {
        return () => {
            activeChannelsRef.current.forEach(channel => {
                supabase.removeChannel(channel);
            });
        };
    }, []);

    useEffect(() => {
        const getUserId = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
            else {
                // Anonymous login or temp ID for demo
                const tempId = localStorage.getItem('temp_user_id') || crypto.randomUUID();
                localStorage.setItem('temp_user_id', tempId);
                setUserId(tempId);
            }
        };
        getUserId();
    }, []);

    const createLobby = async (topic: string, pokemon: any) => {
        if (!userId) return;

        const { data: lobby, error } = await supabase
            .from('lobbies')
            .insert({
                host_id: userId,
                topic,
                player_1_id: userId,
                player_1_pokemon: pokemon,
                status: 'waiting'
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating lobby:', error);
            return;
        }

        setGameState(prev => ({
            ...prev,
            lobbyId: lobby.id,
            isHost: true,
            status: 'waiting'
        }));

        subscribeToLobby(lobby.id);
    };

    const joinLobby = async (lobbyId: string, pokemon: any) => {
        if (!userId) return;

        const { error } = await supabase
            .from('lobbies')
            .update({
                player_2_id: userId,
                player_2_pokemon: pokemon,
                status: 'active' // Trigger game start
            })
            .eq('id', lobbyId);

        if (error) {
            console.error('Error joining lobby:', error);
            return;
        }

        setGameState(prev => ({
            ...prev,
            lobbyId,
            isHost: false,
            status: 'active'
        }));

        subscribeToLobby(lobbyId);
    };

    const subscribeToLobby = (lobbyId: string) => {
        const lobbyChannel = supabase
            .channel(`lobby:${lobbyId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'lobbies', filter: `id=eq.${lobbyId}` },
                async (payload) => {
                    const newLobby = payload.new as any;
                    const currentGameState = gameStateRef.current;

                    if (newLobby.status === 'active' && currentGameState.status === 'waiting') {
                        // Game started!
                        if (currentGameState.isHost) {
                            // Host generates questions and creates battle
                            try {
                                const questions = await generateQuestions(newLobby.topic, 13);

                                const { data: battle, error: battleError } = await supabase
                                    .from('battles')
                                    .insert({
                                        lobby_id: lobbyId,
                                        questions,
                                        current_turn: newLobby.player_1_id, // Host starts
                                        player_1_id: newLobby.player_1_id,
                                        player_2_id: newLobby.player_2_id,
                                        player_1_hp: 10,
                                        player_2_hp: 10
                                    })
                                    .select()
                                    .single();

                                if (battleError) throw battleError;

                                if (battle) enterBattle(battle);
                            } catch (error) {
                                console.error("Error creating battle:", error);
                                // Revert lobby to waiting if battle creation fails so they can try again
                                await supabase
                                    .from('lobbies')
                                    .update({ status: 'waiting', player_2_id: null })
                                    .eq('id', lobbyId);
                            }
                        } else {
                            // Joiner waits for battle creation
                            const { data: battles } = await supabase.from('battles').select('*').eq('lobby_id', lobbyId);
                            if (battles && battles.length > 0) {
                                enterBattle(battles[0]);
                            }
                        }
                    }
                });
        activeChannelsRef.current.push(lobbyChannel);
        lobbyChannel.subscribe();

        // Also listen for battle creation if not host
        const battleChannel = supabase
            .channel(`battles:lobby:${lobbyId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'battles', filter: `lobby_id=eq.${lobbyId}` },
                (payload) => {
                    // If I am NOT host, I should join this battle
                    if (!gameStateRef.current.isHost) {
                    }
                });
        activeChannelsRef.current.push(battleChannel);
        battleChannel.subscribe();
    };

    return {
        gameState,
        createLobby,
        joinLobby,
        submitAnswer,
        requestRematch,
        userId
    };
};
