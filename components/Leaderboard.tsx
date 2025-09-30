import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import type { LeaderboardEntry, UserData } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { TrophyIcon } from './icons';

const Leaderboard: React.FC = () => {
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLocalization();

    useEffect(() => {
        // Fix: Use v8 syntax for collection and querying
        const usersRef = db.collection('users');
        const q = usersRef.orderBy('xp', 'desc').limit(10);

        // Fix: Use v8 syntax for onSnapshot
        const unsubscribe = q.onSnapshot((querySnapshot) => {
            const leaderboardData: LeaderboardEntry[] = [];
            querySnapshot.forEach((doc, index) => {
                const data = doc.data() as UserData;
                leaderboardData.push({
                    rank: index + 1,
                    uid: data.uid,
                    displayName: data.displayName,
                    photoURL: data.photoURL,
                    level: data.level,
                    xp: data.xp
                });
            });
            setLeaders(leaderboardData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching leaderboard:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const rankColor = (rank: number) => {
        switch (rank) {
            case 1: return 'text-yellow-400';
            case 2: return 'text-slate-400';
            case 3: return 'text-yellow-600';
            default: return 'text-slate-500';
        }
    };

    return (
        <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('leaderboard.title')}</h2>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
                {loading ? (
                    <div className="text-center p-4 text-slate-500">{t('leaderboard.loading')}</div>
                ) : leaders.length === 0 ? (
                    <div className="text-center p-4 text-slate-500">{t('leaderboard.empty')}</div>
                ) : (
                    <ul className="space-y-3">
                        {leaders.map((leader) => (
                            <li key={leader.uid} className="flex items-center gap-4 p-2 rounded-md bg-slate-50 dark:bg-slate-700/50">
                                <div className={`w-8 text-center text-xl font-bold ${rankColor(leader.rank)}`}>
                                    {leader.rank <= 3 ? <TrophyIcon /> : leader.rank}
                                </div>
                                <img src={leader.photoURL} alt={leader.displayName} className="w-10 h-10 rounded-full object-cover" />
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{leader.displayName}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('leaderboard.level')} {leader.level}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-indigo-500">{leader.xp} XP</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
};

export default Leaderboard;
