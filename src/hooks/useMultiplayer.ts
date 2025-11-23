import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
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
        supabase
            .channel(`battle:${battleId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'battles', filter: `id=eq.${battleId}` },
                (payload) => {
                    const battle = payload.new as any;
                    setGameState(prev => {
                        const myPlayerId = userId;
                        const opponentPlayerId = myPlayerId === battle.player_1_id ? battle.player_2_id : battle.player_1_id;

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
                })
            .subscribe();
    };

    // Helper to calculate type effectiveness
    const getDamageMultiplier = (attackerType: string, defenderType: string) => {
        const weaknesses: Record<string, string[]> = {
            fire: ['water', 'ground', 'rock'],
            water: ['electric', 'grass'],
            grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
            electric: ['ground'],
            // ... add more types
        };

        if (weaknesses[defenderType]?.includes(attackerType)) {
            return 2;
        }
        return 1;
    };

    const submitAnswer = async (isCorrect: boolean, myPokemonType: string, opponentPokemonType: string) => {
        if (!gameState.battleId || !userId || !gameState.opponent) return;

        if (isCorrect) {
            // Correct Answer Logic
            const damageMultiplier = getDamageMultiplier(opponentPokemonType, myPokemonType);
            const damage = 1 * damageMultiplier;

            const updates: any = {
                current_question_index: gameState.currentQuestionIndex + 1,
                wrong_answer_count: 0 // Reset wrong count on correct answer
            };

            if (gameState.isHost) {
                updates.player_2_hp = gameState.opponentHp - damage;
            } else {
                updates.player_1_hp = gameState.opponentHp - damage;
            }

            // Check for winner
            let newPlayer1Hp = gameState.isHost ? (updates.player_1_hp || gameState.myHp) : gameState.opponentHp;
            let newPlayer2Hp = gameState.isHost ? gameState.opponentHp : (updates.player_2_hp || gameState.myHp);

            if (updates.player_1_hp !== undefined) newPlayer1Hp = updates.player_1_hp;
            if (updates.player_2_hp !== undefined) newPlayer2Hp = updates.player_2_hp;

            if (newPlayer1Hp <= 0) updates.winner_id = gameState.opponent.id;
            else if (newPlayer2Hp <= 0) updates.winner_id = userId;
            else if (updates.current_question_index >= gameState.questions.length) {
                // End of questions
                if (newPlayer1Hp > newPlayer2Hp) updates.winner_id = gameState.isHost ? userId : gameState.opponent.id;
                else if (newPlayer2Hp > newPlayer1Hp) updates.winner_id = gameState.isHost ? gameState.opponent.id : userId;
                else updates.winner_id = gameState.isHost ? userId : gameState.opponent.id;
            }

            await supabase
                .from('battles')
                .update(updates)
                .eq('id', gameState.battleId)
                .eq('current_question_index', gameState.currentQuestionIndex);
        } else {
            // Wrong Answer Logic -> Call RPC
            const { error } = await supabase.rpc('handle_wrong_answer', {
                p_battle_id: gameState.battleId,
                p_player_id: userId
            });

            if (error) {
                console.error("Error submitting wrong answer:", error);
            }
        }
    };

    const [userId, setUserId] = useState<string | null>(null);
    const gameStateRef = useRef(gameState);

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

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
        const channel = supabase
            .channel(`lobby:${lobbyId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'lobbies', filter: `id=eq.${lobbyId}` },
                async (payload) => {
                    const newLobby = payload.new as any;
                    const currentGameState = gameStateRef.current;

                    if (newLobby.status === 'active' && currentGameState.status === 'waiting') {
                        // Game started!
                        if (currentGameState.isHost) {
                            // Host generates questions and creates battle
                            // Use the existing generateQuestions from data/questions which handles Edge Functions and fallbacks
                            const questions = await generateQuestions(newLobby.topic, 10);

                            const { data: battle, error: battleError } = await supabase
                                .from('battles')
                                .insert({
                                    lobby_id: lobbyId,
                                    questions,
                                    current_turn: newLobby.player_1_id, // Host starts
                                    player_1_id: newLobby.player_1_id,
                                    player_2_id: newLobby.player_2_id
                                })
                                .select()
                                .single();

                            if (battleError) {
                                console.error("Error creating battle:", battleError);
                                alert(`Error creating battle: ${battleError.message}. Please run the migration SQL.`);
                                return;
                            }

                            if (battle) enterBattle(battle);
                        } else {
                            // Joiner waits for battle creation
                            // We'll listen for battle creation via a separate subscription or query
                            // For simplicity, let's query for the battle associated with this lobby
                            const { data: battles } = await supabase.from('battles').select('*').eq('lobby_id', lobbyId);
                            if (battles && battles.length > 0) {
                                enterBattle(battles[0]);
                            }
                        }
                    }
                })
            .subscribe();

        // Also listen for battle creation if not host
        // We use a timeout to allow state to settle, but better to rely on ref or just subscribe always
        // If we are host, this subscription is redundant but harmless

        supabase
            .channel(`battles:lobby:${lobbyId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'battles', filter: `lobby_id=eq.${lobbyId}` },
                (payload) => {
                    // If I am NOT host, I should join this battle
                    if (!gameStateRef.current.isHost) {
                        enterBattle(payload.new);
                    }
                })
            .subscribe();
    };



    return {
        gameState,
        createLobby,
        joinLobby,
        submitAnswer,
        userId
    };
};
