

import React from 'react';
import { useUserData } from '../hooks/useUserData';
import { useLocalization } from '../hooks/useLocalization';
import { AppView } from '../types';
import { HIRAGANA_DATA, KATAKANA_DATA, KANJI_DATA, ACHIEVEMENTS } from '../constants';
import { BookOpenIcon, StarIcon, TrophyIcon, LanguageIcon, LockIcon } from './icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
    setView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
    const { userData } = useUserData();
    const { t } = useLocalization();

    const hiraganaLearned = Object.values(userData.hiraganaMastery).filter(m => m.level > 0).length;
    const katakanaLearned = Object.values(userData.katakanaMastery).filter(m => m.level > 0).length;
    const kanjiLearned = Object.values(userData.kanjiMastery).filter(m => m.level > 0).length;

    const chartData = userData.dailyProgress.slice(-7).map(d => ({
        name: new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' }),
        xp: d.xp,
    }));
    
    // Progress towards unlocks
    const hiraganaMasteryPercent = (hiraganaLearned / HIRAGANA_DATA.length);
    const katakanaMasteryPercent = (katakanaLearned / KATAKANA_DATA.length);
    const kanjiMasteryPercent = (kanjiLearned / KANJI_DATA.length);

    // Words unlock: 100% Hira, 100% Kata, 20% Kanji
    const WORDS_UNLOCK_REQ = { h: 1.0, k: 1.0, j: 0.2 };
    const wordsProgress = Math.min(
        (
            (Math.min(hiraganaMasteryPercent / WORDS_UNLOCK_REQ.h, 1.0) * 0.45) +
            (Math.min(katakanaMasteryPercent / WORDS_UNLOCK_REQ.k, 1.0) * 0.45) +
            (Math.min(kanjiMasteryPercent / WORDS_UNLOCK_REQ.j, 1.0) * 0.10)
        ) * 100,
        100
    );
    const isWordsLocked = wordsProgress < 100;

    // Sentences unlock: 100% Hira, 100% Kata, 50% Kanji
    const SENTENCES_UNLOCK_REQ = { h: 1.0, k: 1.0, j: 0.5 };
    const sentencesProgress = Math.min(
        (
            (Math.min(hiraganaMasteryPercent / SENTENCES_UNLOCK_REQ.h, 1.0) * 0.35) +
            (Math.min(katakanaMasteryPercent / SENTENCES_UNLOCK_REQ.k, 1.0) * 0.35) +
            (Math.min(kanjiMasteryPercent / SENTENCES_UNLOCK_REQ.j, 1.0) * 0.30)
        ) * 100,
        100
    );
    const isSentencesLocked = sentencesProgress < 100;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('dashboard.welcome')}</h1>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title={t('dashboard.hiraganaLearned')} value={`${hiraganaLearned} / ${HIRAGANA_DATA.length}`} icon={<LanguageIcon className="text-pink-500" />} />
                <StatCard title={t('dashboard.katakanaLearned')} value={`${katakanaLearned} / ${KATAKANA_DATA.length}`} icon={<LanguageIcon className="text-blue-500" />} />
                <StatCard title={t('dashboard.kanjiLearned')} value={`${kanjiLearned} / ${KANJI_DATA.length}`} icon={<BookOpenIcon className="text-green-500" />} />
                <StatCard title={t('dashboard.achievements')} value={`${userData.achievements.length} / ${ACHIEVEMENTS.length}`} icon={<TrophyIcon className="text-yellow-500" />} />
            </div>

            {/* Learning Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ModuleCard title={t('dashboard.module.learnHiragana.title')} description={t('dashboard.module.learnHiragana.description')} onClick={() => setView(AppView.Hiragana)} />
                <ModuleCard title={t('dashboard.module.learnKatakana.title')} description={t('dashboard.module.learnKatakana.description')} onClick={() => setView(AppView.Katakana)} />
                <ModuleCard title={t('dashboard.module.learnKanji.title')} description={t('dashboard.module.learnKanji.description')} onClick={() => setView(AppView.Kanji)} />
                <ModuleCard 
                    title={t('dashboard.module.wordBuilder.title')} 
                    description={t('dashboard.module.wordBuilder.description')} 
                    onClick={() => !isWordsLocked && setView(AppView.Words)}
                    isLocked={isWordsLocked}
                    progress={wordsProgress}
                />
                <ModuleCard 
                    title={t('dashboard.module.sentencePractice.title')} 
                    description={t('dashboard.module.sentencePractice.description')} 
                    onClick={() => !isSentencesLocked && setView(AppView.Sentences)} 
                    isLocked={isSentencesLocked}
                    progress={sentencesProgress}
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Progress */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">{t('dashboard.weeklyXP')}</h3>
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
                    <h3 className="text-lg font-semibold mb-4">{t('achievements.title')}</h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {ACHIEVEMENTS.map(ach => (
                            <div key={ach.id} className={`flex items-center gap-4 p-3 rounded-lg ${userData.achievements.includes(ach.id) ? 'bg-green-100 dark:bg-green-900 dark:bg-opacity-50' : 'bg-slate-100 dark:bg-slate-700 dark:bg-opacity-50 opacity-60'}`}>
                                <div className={`text-2xl ${userData.achievements.includes(ach.id) ? 'text-green-500' : 'text-slate-400'}`}>
                                    {ach.icon}
                                </div>
                                <div>
                                    <p className="font-semibold">{t(ach.nameKey)}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{t(ach.descriptionKey)}</p>
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

const ModuleCard: React.FC<{
    title: string;
    description: string;
    onClick: () => void;
    isLocked?: boolean;
    progress?: number;
}> = ({ title, description, onClick, isLocked = false, progress = 0 }) => {
    const { t } = useLocalization();
    const lockedClasses = "opacity-70 cursor-not-allowed";
    const unlockedClasses = "hover:shadow-xl hover:scale-105 transition-transform duration-200 cursor-pointer";

    return (
        <div
            className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden ${isLocked ? lockedClasses : unlockedClasses}`}
            onClick={isLocked ? undefined : onClick}
        >
            <h3 className={`text-lg font-semibold mb-2 ${isLocked ? 'text-slate-500 dark:text-slate-400' : 'text-indigo-600 dark:text-indigo-400'}`}>{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{description}</p>
            {isLocked && (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('dashboard.unlockProgress')}</span>
                        <span className="text-xs font-bold text-indigo-500">{Math.floor(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="absolute top-4 right-4 text-slate-400 dark:text-slate-500">
                       <LockIcon className="text-lg" />
                    </div>
                </div>
            )}
        </div>
    );
};


export default Dashboard;