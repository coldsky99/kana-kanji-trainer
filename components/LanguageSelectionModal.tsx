import React from 'react';
import { GlobeIcon } from './icons';

type Language = 'en' | 'id';

interface LanguageSelectionModalProps {
  onSelectLanguage: (language: Language) => void;
  supportedLanguages: Language[];
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  onSelectLanguage,
  supportedLanguages
}) => {
  
  const languageNames = {
    en: 'English',
    id: 'Bahasa Indonesia'
  };
  
  const languageFlags = {
    en: '🇺🇸',
    id: '🇮🇩'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl transform transition-all">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
            <GlobeIcon className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Select Your Language
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Choose your preferred language to continue.
          </p>
        </div>
        
        <div className="space-y-3">
          {supportedLanguages.map((language) => (
            <button
              key={language}
              onClick={() => onSelectLanguage(language)}
              className="w-full flex items-center p-4 border dark:border-slate-700 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="text-2xl mr-4">{languageFlags[language]}</span>
              <span className="text-lg font-medium text-slate-800 dark:text-slate-200">
                {languageNames[language]}
              </span>
            </button>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            You can change this later in the header menu.
          </p>
        </div>
      </div>
    </div>
  );
};