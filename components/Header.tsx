
import React from 'react';
import { useUserData } from '../hooks/useUserData';
import { AppView } from '../types';
import { HomeIcon, LanguageIcon, BookOpenIcon, StarIcon } from './icons';

interface HeaderProps {
    currentView: AppView;
    setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
    const { userData } = useUserData();

    const navItems = [
        { view: AppView.Dashboard, label: 'Dashboard', icon: <HomeIcon /> },
        { view: AppView.Hiragana, label: 'Hiragana', icon: <LanguageIcon /> },
        { view: AppView.Katakana, label: 'Katakana', icon: <LanguageIcon /> },
        { view: AppView.Kanji, label: 'Kanji', icon: <BookOpenIcon /> },
        { view: AppView.Words, label: 'Words', icon: <StarIcon /> },
        { view: AppView.Sentences, label: 'Sentences', icon: <BookOpenIcon /> },
    ];

    return (
        <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <img src="https://picsum.photos/seed/logo/40/40" alt="Logo" className="rounded-full" />
                    <h1 className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400">Nihongo Master</h1>
                </div>

                <div className="hidden md:flex space-x-1">
                    {navItems.map(item => (
                        <button
                            key={item.view}
                            onClick={() => setView(item.view)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                                currentView === item.view
                                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:bg-opacity-50 dark:text-indigo-300'
                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                            }`}
                        >
                           {item.icon} {item.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">Level {userData.level}</div>
                        <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                            <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${(userData.xp / 100) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Nav */}
            <div className="md:hidden flex justify-around p-2 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                 {navItems.map(item => (
                        <button
                            key={item.view}
                            onClick={() => setView(item.view)}
                            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors duration-200 flex flex-col items-center gap-1 ${
                                currentView === item.view
                                    ? 'text-indigo-700 dark:text-indigo-300'
                                    : 'text-slate-600 dark:text-slate-300'
                            }`}
                        >
                           {React.cloneElement(item.icon, {className: "text-lg"})}
                           <span>{item.label}</span>
                        </button>
                    ))}
            </div>
        </header>
    );
};

export default Header;
