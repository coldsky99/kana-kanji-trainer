
import React from 'react';
import { useUserData } from '../hooks/useUserData';
import { AppView } from '../types';
import { HIRAGANA_DATA, KATAKANA_DATA, KANJI_DATA, ACHIEVEMENTS } from '../constants';
import { BookOpenIcon, StarIcon, TrophyIcon, LanguageIcon } from './icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
    setView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
    const { userData } = useUserData();

    const hiraganaLearned = Object.values(userData.hiraganaMastery).filter(m => m.level > 0).length;
    const katakanaLearned = Object.values(userData.katakanaMastery).filter(m => m.level > 0).length;
    const kanjiLearned = Object.values(userData.kanjiMastery).filter(m => m.level > 0).length;

    const unlockedAchievements = ACHIEVEMENTS.filter(ach => userData.achievements.includes(ach.id));

    const chartData = userData.dailyProgress.slice(-7).map(d => ({
        name: new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' }),
        xp: d.xp,
    }));

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Welcome back!</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Hiragana Learned" value={`${hiraganaLearned} / ${HIRAGANA_DATA.length}`} icon={<LanguageIcon className="text-pink-500" />} />
                <StatCard title="Katakana Learned" value={`${katakanaLearned} / ${KATAKANA_DATA.length}`} icon={<LanguageIcon className="text-blue-500" />} />
                <StatCard title="Kanji Learned" value={`${kanjiLearned} / ${KANJI_DATA.length}`} icon={<BookOpenIcon className="text-green-500" />} />
                <StatCard title="Achievements" value={`${unlockedAchievements.length} / ${ACHIEVEMENTS.length}`} icon={<TrophyIcon className="text-yellow-500" />} />
            </div>

            {/* Learning Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ModuleCard title="Learn Hiragana" description="Start with the basic Japanese phonetic script." onClick={() => setView(AppView.Hiragana)} />
                <ModuleCard title="Learn Katakana" description="Learn the script for foreign words and emphasis." onClick={() => setView(AppView.Katakana)} />
                <ModuleCard title="Learn Kanji" description="Begin your journey into Chinese characters." onClick={() => setView(AppView.Kanji)} />
                <ModuleCard title="Word Builder" description="Form words with the characters you've learned." onClick={() => setView(AppView.Words)} />
                <ModuleCard title="Sentence Practice" description="Read and understand Japanese sentences." onClick={() => setView(AppView.Sentences)} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Progress */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Weekly XP Progress</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="rgb(100 116 139)" />
                                <YAxis stroke="rgb(100 116 139)" />
                                <Tooltip contentStyle={{ backgroundColor: 'rgb(30 41 59)', border: 'none', borderRadius: '0.5rem' }} />
                                <Legend />
                                <Bar dataKey="xp" fill="rgb(99 102 241)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Achievements */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">Achievements</h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {ACHIEVEMENTS.map(ach => (
                            <div key={ach.id} className={`flex items-center gap-4 p-3 rounded-lg ${userData.achievements.includes(ach.id) ? 'bg-green-100 dark:bg-green-900 dark:bg-opacity-50' : 'bg-slate-100 dark:bg-slate-700 dark:bg-opacity-50 opacity-60'}`}>
                                <div className={`text-2xl ${userData.achievements.includes(ach.id) ? 'text-green-500' : 'text-slate-400'}`}>
                                    {ach.icon}
                                </div>
                                <div>
                                    <p className="font-semibold">{ach.name}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{ach.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex items-center space-x-4">
        <div className="text-3xl">{icon}</div>
        <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const ModuleCard: React.FC<{ title: string; description: string; onClick: () => void; }> = ({ title, description, onClick }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-200 cursor-pointer" onClick={onClick}>
        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </div>
);


export default Dashboard;
