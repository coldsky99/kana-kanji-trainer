import React from 'react';
import { useUserData } from '../hooks/useUserData';
import { useLocalization } from '../hooks/useLocalization';
import { AppView } from '../types';
import { HIRAGANA_DATA, KATAKANA_DATA, KANJI_DATA, XP_PER_LEVEL, ACHIEVEMENTS } from '../constants';
import { TrophyIcon, StarIcon, BookOpenIcon, LockIcon, QuestionMarkCircleIcon } from './icons';
import Tooltip from './Tooltip';

// Helper component for individual stats
const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex items-center space-x-4">
        <div className="text-2xl text-indigo-500">{icon}</div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    </div>
);

// Helper component for learning modules
const ModuleCard: React.FC<{
    title: string;
    description: string;
    onClick: () => void;
    unlocked: boolean;
    progressPercent: number;
    unlockHint?: string;
}> = ({ title, description, onClick, unlocked, progressPercent, unlockHint }) => (
    <div
        onClick={unlocked ? onClick : undefined}
        className={`relative p-6 rounded-lg shadow-lg transition-all duration-300 ${unlocked ? 'bg-white dark:bg-slate-800 cursor-pointer hover:shadow-xl hover:-translate-y-1' : 'bg-slate-100 dark:bg-slate-800/50'}`}
    >
        {!unlocked && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <LockIcon className="text-slate-500 dark:text-slate-400" />
                {unlockHint && (
                    <Tooltip text={unlockHint}>
                        <QuestionMarkCircleIcon className="text-slate-500 dark:text-slate-400 cursor-help" />
                    </Tooltip>
                )}
            </div>
        )}
        <h3 className={`text-xl font-bold mb-2 ${!unlocked && 'text-slate-500 dark:text-slate-400'}`}>{title}</h3>
        <p className={`text-sm text-slate-600 dark:text-slate-300 mb-4 ${!unlocked && 'opacity-60'}`}>{description}</p>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
        </div>
    </div>
);


const Dashboard: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
    const { userData } = useUserData();
    const { t } = useLocalization();

    // --- Calculations ---
    const hiraMasteryCount = Object.keys(userData.hiraganaMastery).length;
    const kataMasteryCount = Object.keys(userData.katakanaMastery).length;
    const kanjiMasteryCount = Object.keys(userData.kanjiMastery).length;

    const hiraPct = (hiraMasteryCount / HIRAGANA_DATA.length) * 100;
    const kataPct = (kataMasteryCount / KATAKANA_DATA.length) * 100;
    const kanjiPct = (kanjiMasteryCount / KANJI_DATA.length) * 100;

    const wordsUnlocked = hiraPct >= 100 && kataPct >= 100 && kanjiPct >= 20;
    const sentencesUnlocked = hiraPct >= 100 && kataPct >= 100 && kanjiPct >= 50;
    
    const calculateStreak = (dailyProgress: typeof userData.dailyProgress): number => {
        if (dailyProgress.length === 0) return 0;

        // Fix: Cast arguments to `new Date` to string to handle `unknown` type from `any[]`.
        // This prevents errors when `dailyProgress` is inferred as `any[]` from localStorage.
        const dates = [...new Set(dailyProgress.map(d => String(d.date)))].sort((a, b) => new Date(b as string).getTime() - new Date(a as string).getTime());
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let lastDate = new Date(dates[0] as string);
        lastDate.setHours(0, 0, 0, 0);

        if (lastDate.getTime() !== today.getTime() && lastDate.getTime() !== yesterday.getTime()) {
            return 0;
        }

        let streak = 1;
        for (let i = 1; i < dates.length; i++) {
            const currentDate = new Date(dates[i] as string);
            currentDate.setHours(0, 0, 0, 0);
            
            const expectedPreviousDate = new Date(lastDate);
            expectedPreviousDate.setDate(expectedPreviousDate.getDate() - 1);
            
            if (currentDate.getTime() === expectedPreviousDate.getTime()) {
                streak++;
                lastDate = currentDate;
            } else if (currentDate.getTime() < expectedPreviousDate.getTime()) {
                break;
            }
        }
        return streak;
    };
    
    const dailyStreak = calculateStreak(userData.dailyProgress);
    const earnedAchievements = ACHIEVEMENTS.filter(ach => userData.achievements.includes(ach.id));
    
    return (
        <div className="space-y-8">
            {/* Stats Panel */}
            <section>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('dashboard.welcome')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label={t('dashboard.stats.level')} value={userData.level} icon={<TrophyIcon />} />
                    <StatCard label={t('dashboard.stats.xp')} value={`${userData.xp} / ${XP_PER_LEVEL}`} icon={<StarIcon />} />
                    <StatCard label={t('dashboard.stats.streak')} value={`${dailyStreak} Days`} icon={<i className="fa-solid fa-fire"></i>} />
                    <StatCard label={t('dashboard.stats.characters')} value={hiraMasteryCount + kataMasteryCount + kanjiMasteryCount} icon={<BookOpenIcon />} />
                </div>
                 <div className="mt-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{t('dashboard.progress.toNextLevel')}</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(userData.xp / XP_PER_LEVEL) * 100}%` }}></div>
                    </div>
                </div>
            </section>

            {/* Learning Modules */}
            <section>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('dashboard.modules')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ModuleCard 
                        title={t('dashboard.module.learnHiragana.title')}
                        description={t('dashboard.module.learnHiragana.description')}
                        onClick={() => setView(AppView.Hiragana)}
                        unlocked={true}
                        progressPercent={hiraPct}
                    />
                    <ModuleCard 
                        title={t('dashboard.module.learnKatakana.title')}
                        description={t('dashboard.module.learnKatakana.description')}
                        onClick={() => setView(AppView.Katakana)}
                        unlocked={true}
                        progressPercent={kataPct}
                    />
                     <ModuleCard 
                        title={t('dashboard.module.learnKanji.title')}
                        description={t('dashboard.module.learnKanji.description')}
                        onClick={() => setView(AppView.Kanji)}
                        unlocked={true}
                        progressPercent={kanjiPct}
                    />
                     <ModuleCard 
                        title={t('dashboard.module.buildWords.title')}
                        description={t('dashboard.module.buildWords.description')}
                        onClick={() => setView(AppView.Words)}
                        unlocked={wordsUnlocked}
                        progressPercent={(wordsUnlocked || (hiraPct === 100 && kataPct === 100)) ? (kanjiPct / 20 * 100) : ((hiraPct + kataPct)/2)}
                        unlockHint={t('dashboard.unlocks.hint.words')}
                    />
                    <ModuleCard 
                        title={t('dashboard.module.practiceSentences.title')}
                        description={t('dashboard.module.practiceSentences.description')}
                        onClick={() => setView(AppView.Sentences)}
                        unlocked={sentencesUnlocked}
                        progressPercent={(sentencesUnlocked || (hiraPct === 100 && kataPct === 100)) ? (kanjiPct / 50 * 100) : ((hiraPct + kataPct)/2)}
                        unlockHint={t('dashboard.unlocks.hint.sentences')}
                    />
                </div>
            </section>

            {/* Achievements Panel */}
            <section>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('dashboard.achievements.title')}</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {earnedAchievements.length > 0 ? (
                        earnedAchievements.map(ach => (
                            <Tooltip key={ach.id} text={t(ach.descriptionKey as any)}>
                                <div className="aspect-square">
                                    <div className="w-full h-full flex flex-col items-center text-center p-2 sm:p-3 bg-white dark:bg-slate-800 rounded-lg shadow-md transition-transform hover:scale-105">
                                        <div className="flex-1 flex items-center justify-center text-3xl sm:text-4xl text-yellow-500">
                                            {ach.icon}
                                        </div>
                                        <p className="text-xs font-semibold leading-tight h-8 shrink-0 flex items-center justify-center">
                                            {t(ach.nameKey as any)}
                                        </p>
                                    </div>
                                </div>
                            </Tooltip>
                        ))
                    ) : (
                        <p className="col-span-full text-slate-500">{t('dashboard.achievements.none')}</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;