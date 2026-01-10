import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, CheckCircle2, Circle } from 'lucide-react';

interface Quest {
    quest_id: string;
    title: string;
    description: string;
    target_count: number;
    progress: number;
    completed: boolean;
    reward_xp: number;
}

export function DailyChallenges() {
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchQuests();

        // Subscribe to changes
        const subscription = supabase
            .channel('quest_updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'user_quest_progress'
            }, () => {
                fetchQuests();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchQuests = async () => {
        try {
            setError(null);
            const { data, error } = await supabase.rpc('get_daily_quests');
            if (error) throw error;
            setQuests(data || []);
        } catch (error: any) {
            console.error('Error fetching quests:', error);
            setError(error.message || "Failed to load quests");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="animate-pulse h-48 bg-slate-800/50 rounded-xl"></div>;
    }

    if (error) {
        return (
            <Card className="bg-red-900/20 border-red-500/50">
                <CardContent className="pt-6 text-center text-red-400">
                    <p>Error: {error}</p>
                    <button onClick={fetchQuests} className="mt-2 underline hover:text-red-300">Retry</button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-slate-900/50 border-2 border-slate-700 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-xl text-yellow-400 font-pixel">
                    <Trophy className="w-6 h-6" />
                    Daily Challenges
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {quests.map((quest) => (
                    <div key={quest.quest_id} className="space-y-2">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h4 className={`font-bold ${quest.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                                        {quest.title}
                                    </h4>
                                    {quest.completed && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                                </div>
                                <p className="text-xs text-muted-foreground">{quest.description}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-mono text-yellow-400">
                                    +{quest.reward_xp} XP
                                </span>
                            </div>
                        </div>

                        <div className="relative h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                            <div
                                className={`absolute top-0 left-0 h-full transition-all duration-500 ${quest.completed ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                style={{ width: `${Math.min((quest.progress / quest.target_count) * 100, 100)}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                                {quest.progress} / {quest.target_count}
                            </div>
                        </div>
                    </div>
                ))}

                {quests.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No quests available today.</p>
                )}
            </CardContent>
        </Card>
    );
}
