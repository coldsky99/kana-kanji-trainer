

import React from 'react';
import { useUserData } from '../hooks/useUserData';
import { useLocalization } from '../hooks/useLocalization';
import { AppView } from '../types';
import type { MasteryItem } from '../types';
import { XP_PER_LEVEL, ACHIEVEMENTS, HIRAGANA_DATA, KATAKANA_DATA, KANJI_DATA } from '../constants';
import { BookOpenIcon, StarIcon, LockIcon, UserIcon } from './icons';
import Tooltip from './Tooltip';
import type { TranslationKey } from '../hooks/useLocalization';

interface DashboardProps {
  setView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const { userData, resetUserData } = useUserData();
  const { t } = useLocalization();
  const [showResetModal, setShowResetModal] = React.useState(false);

  if (!userData) {
    return null; // App.tsx handles the main loading state
  }

  const progressPercentage = (userData.xp / XP_PER_LEVEL) * 100;

  // FIX: Explicitly type `item` as `MasteryItem` to resolve a TypeScript inference issue where it was being inferred as `unknown`.
  const hiraganaMasteryCount = Object.values(userData.hiraganaMastery).filter((item: MasteryItem) => item.level > 0).length;
  const katakanaMasteryCount = Object.values(userData.katakanaMastery).filter((item: MasteryItem) => item.level > 0).length;
  const kanjiMasteryCount = Object.values(userData.kanjiMastery).filter((item: MasteryItem) => item.level > 0).length;

  const hiraganaMastered = hiraganaMasteryCount >= HIRAGANA_DATA.length;
  const katakanaMastered = katakanaMasteryCount >= KATAKANA_DATA.length;

  const isWordsUnlocked = hiraganaMastered && katakanaMastered && (kanjiMasteryCount / KANJI_DATA.length) * 100 >= 20;
  const isSentencesUnlocked = hiraganaMastered && katakanaMastered && (kanjiMasteryCount / KANJI_DATA.length) * 100 >= 50;

  const handleReset = () => {
    resetUserData();
    setShowResetModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Welcome and Progress */}
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {t('dashboard.welcome', { name: userData.displayName })}
        </h1>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full border-4 border-indigo-200 dark:border-indigo-700 shadow-sm flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
              <UserIcon className="text-3xl" />
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-1">
              <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{t('dashboard.level')} {userData.level}</span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{userData.xp} / {XP_PER_LEVEL} XP</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-right text-slate-500 mt-1">{t('dashboard.progress.toNextLevel')}</p>
          </div>
        </div>
      </div>
      
      {/* Learning Modules */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">{t('dashboard.modules')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModuleCard
            title={t('dashboard.module.learnHiragana.title')}
            description={t('dashboard.module.learnHiragana.description')}
            icon={<div className="text-3xl">あ</div>}
            onClick={() => setView(AppView.Hiragana)}
            color="bg-red-500"
          />
          <ModuleCard
            title={t('dashboard.module.learnKatakana.title')}
            description={t('dashboard.module.learnKatakana.description')}
            icon={<div className="text-3xl">ア</div>}
            onClick={() => setView(AppView.Katakana)}
            color="bg-blue-500"
          />
          <ModuleCard
            title={t('dashboard.module.learnKanji.title')}
            description={t('dashboard.module.learnKanji.description')}
            icon={<div className="text-3xl">漢</div>}
            onClick={() => setView(AppView.Kanji)}
            color="bg-green-500"
          />
          <ModuleCard
            title={t('dashboard.module.buildWords.title')}
            description={t('dashboard.module.buildWords.description')}
            icon={<StarIcon className="text-2xl"/>}
            onClick={() => isWordsUnlocked && setView(AppView.Words)}
            locked={!isWordsUnlocked}
            unlockHint={t('dashboard.unlocks.hint.words')}
            color="bg-yellow-500"
          />
          <ModuleCard
            title={t('dashboard.module.practiceSentences.title')}
            description={t('dashboard.module.practiceSentences.description')}
            icon={<BookOpenIcon className="text-2xl"/>}
            onClick={() => isSentencesUnlocked && setView(AppView.Sentences)}
            locked={!isSentencesUnlocked}
            unlockHint={t('dashboard.unlocks.hint.sentences')}
            color="bg-purple-500"
          />
        </div>
      </div>
      
      {/* Achievements */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">{t('dashboard.achievements.title')}</h2>
        <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="space-y-3">
            {ACHIEVEMENTS.map(ach => {
              const isUnlocked = userData.achievements.includes(ach.id);
              return (
                <div 
                  key={ach.id} 
                  className={`flex items-center p-3 rounded-lg transition-all duration-300 ${isUnlocked ? 'bg-amber-50 dark:bg-slate-700/80' : 'bg-transparent dark:bg-transparent'}`}
                >
                  <div className={`text-3xl mr-4 w-10 text-center ${isUnlocked ? 'text-yellow-500' : 'text-slate-400 dark:text-slate-500'}`}>
                    {ach.icon}
                  </div>
                  <div className="flex-grow">
                    <h4 className={`font-bold ${isUnlocked ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                      {t(ach.nameKey as TranslationKey)}
                    </h4>
                    <p className={`text-sm ${isUnlocked ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'}`}>
                      {t(ach.descriptionKey as TranslationKey)}
                    </p>
                  </div>
                  {isUnlocked && (
                    <div className="text-green-500 ml-4">
                      <i className="fa-solid fa-check-circle text-2xl"></i>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6 border border-red-200 dark:border-red-700/50">
        <h3 className="text-lg font-bold text-red-600 dark:text-red-400">{t('dashboard.settings.title')}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 mb-4">{t('dashboard.settings.reset.description')}</p>
        <button
          onClick={() => setShowResetModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
        >
          {t('dashboard.settings.reset.button')}
        </button>
      </div>
      
      {showResetModal && (
        <ResetModal
          onConfirm={handleReset}
          onCancel={() => setShowResetModal(false)}
        />
      )}
    </div>
  );
};

interface ModuleCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    color?: string;
    locked?: boolean;
    unlockHint?: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ title, description, icon, onClick, color = 'bg-gray-500', locked, unlockHint }) => {
    const { t } = useLocalization();
    const cardContent = (
        <div className={`relative p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md flex flex-col justify-between h-full transition-all duration-300 border border-slate-200 dark:border-slate-700 ${locked ? 'cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'}`}>
            {locked && (
                <div className="absolute inset-0 bg-slate-400/30 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
                    <LockIcon className="text-4xl text-slate-500" />
                </div>
            )}
            <div className="flex-grow">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 ${color}`}>
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
            </div>
            <div className={`mt-4 text-right font-semibold text-sm ${locked ? 'text-slate-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                {locked ? t('dashboard.locked') : 'Start Learning →'}
            </div>
        </div>
    );

    const Wrapper = locked && unlockHint ? Tooltip : React.Fragment;
    const wrapperProps = locked && unlockHint ? { text: unlockHint, className: 'h-full' } : {};

    return (
        <div className="h-full" onClick={locked ? undefined : onClick}>
            <Wrapper {...wrapperProps}>
                {cardContent}
            </Wrapper>
        </div>
    );
};

const ResetModal: React.FC<{ onConfirm: () => void, onCancel: () => void }> = ({ onConfirm, onCancel }) => {
    const { t } = useLocalization();
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-md text-center">
                <h2 className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">{t('resetModal.title')}</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{t('resetModal.warning')}</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onCancel}
                        className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 px-6 py-2 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                    >
                        {t('resetModal.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                        {t('resetModal.confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default Dashboard;