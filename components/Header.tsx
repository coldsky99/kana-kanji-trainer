

import React, { useState, useRef, useEffect } from 'react';
import { useUserData } from '../hooks/useUserData';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { AppView } from '../types';
import { GlobeIcon } from './icons';

interface HeaderProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const { userData } = useUserData();
  const { user, signOut } = useAuth();
  const { language, changeLanguage, t } = useLocalization();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const totalCharactersLearned = 
    Object.keys(userData?.hiraganaMastery || {}).length +
    Object.keys(userData?.katakanaMastery || {}).length +
    Object.keys(userData?.kanjiMastery || {}).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSetLanguage = (lang: 'en' | 'id') => {
    changeLanguage(lang);
    setIsLangDropdownOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 shadow-md dark:border-b dark:border-slate-700 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(AppView.Dashboard)}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-6 bg-red-500 rounded-sm flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full">
                </div>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-slate-100">Nihongo Master</h1>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setView(AppView.Dashboard)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentView === AppView.Dashboard
                ? 'bg-red-500 text-white'
                : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            {t('header.dashboard')}
          </button>
        </nav>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-sm text-gray-600 dark:text-slate-400">{t('header.level')} {userData?.level}</div>
            <div className="text-xs text-gray-500">{totalCharactersLearned} {t('header.characters')}</div>
          </div>
          <div className="relative" ref={userDropdownRef}>
            <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700">
              <img src={user?.photoURL || ''} alt={user?.displayName || 'User'} className="w-10 h-10 rounded-full object-cover" />
            </button>
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-10 border dark:border-slate-600">
                <div className="px-4 py-2 border-b dark:border-slate-600">
                  <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-100">{user?.displayName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); signOut(); setIsUserDropdownOpen(false); }}
                  className='block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                >
                  {t('header.logout')}
                </a>
              </div>
            )}
          </div>
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <GlobeIcon className="text-lg" />
            </button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-10 border dark:border-slate-600">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleSetLanguage('en'); }}
                  className={`block px-4 py-2 text-sm ${language === 'en' ? 'bg-indigo-500 text-white' : 'text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600'}`}
                >
                  English
                </a>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleSetLanguage('id'); }}
                  className={`block px-4 py-2 text-sm ${language === 'id' ? 'bg-indigo-500 text-white' : 'text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600'}`}
                >
                  Bahasa Indonesia
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;