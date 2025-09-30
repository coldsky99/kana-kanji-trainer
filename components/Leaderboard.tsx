import React, { useState, useEffect } from 'react';
import type { LeaderboardEntry } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { useAuth } from '../hooks/useAuth';

const Leaderboard: React.FC = () => {
    const { t } = useLocalization();
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/db/leaderboard');
                if (!response.ok) {
                    throw new Error('Failed to fetch leaderboard');
                }
                const data: LeaderboardEntry[] = await response.json();
                setLeaderboard(data);
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const renderBody = () => {
        if (loading) {
            return (
                <tr>
                    <td colSpan={4} className="text-center p-4">
                         <div className="animate-pulse flex flex-col items-center gap-4 py-2">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                         </div>
                    </td>
                </tr>
            );
        }

        if (leaderboard.length === 0) {
            return (
                <tr>
                    <td colSpan={4} className="text-center p-4 text-slate-500">
                        {t('leaderboard.empty')}
                    </td>
                </tr>
            );
        }

        return leaderboard.map((entry) => (
// FIX: Use `entry.id` and `entry.photoUrl` to match the LeaderboardEntry type and API response.
            <tr key={entry.id} className={`border-b dark:border-slate-700 ${entry.id === user?.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
                <td className="p-3 font-bold text-center">{entry.rank}</td>
                <td className="p-3">
                    <div className="flex items-center gap-3">
                        <img src={entry.photoUrl} alt={entry.displayName} className="w-8 h-8 rounded-full object-cover"/>
                        <span className="font-medium truncate">{entry.displayName}</span>
                    </div>
                </td>
                <td className="p-3 text-center">{entry.level}</td>
                <td className="p-3 text-center">{entry.xp}</td>
            </tr>
        ));
    };

    return (
        <section>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('leaderboard.title')}</h2>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="p-3 text-left w-12 font-semibold text-slate-600 dark:text-slate-300 text-center">{t('leaderboard.rank')}</th>
                            <th className="p-3 text-left font-semibold text-slate-600 dark:text-slate-300">{t('leaderboard.player')}</th>
                            <th className="p-3 text-left w-16 font-semibold text-slate-600 dark:text-slate-300 text-center">{t('leaderboard.level')}</th>
                            <th className="p-3 text-left w-16 font-semibold text-slate-600 dark:text-slate-300 text-center">{t('leaderboard.xp')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderBody()}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Leaderboard;
