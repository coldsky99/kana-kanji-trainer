import React from 'react';
import { AppView } from '../types';
import { useUserData } from '../hooks/useUserData';

interface HeaderProps {
    currentView: AppView;
    setView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
    const { userData } = useUserData();

    const totalCharactersLearned = 
        Object.values(userData.hiraganaMastery).filter(m => m.level > 0).length +
        Object.values(userData.katakanaMastery).filter(m => m.level > 0).length +
        Object.values(userData.kanjiMastery).filter(m => m.level > 0).length;

    return (
        <header className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo Section with Japanese Flag and App Name */}
                <div className="flex items-center space-x-3">
                    {/* Japanese Flag Icon */}
                    <div className="w-10 h-7 relative overflow-hidden rounded-sm border border-white border-opacity-30 shadow-sm">
                        <div className="w-full h-full bg-white relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-5 h-5 bg-red-600 rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* App Name */}
                    <h1 className="text-2xl font-bold tracking-wide">
                        Nihongo Master
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex space-x-2">
                    <button
                        onClick={() => setView(AppView.Dashboard)}
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                            currentView === AppView.Dashboard
                                ? 'bg-white text-red-500 font-semibold'
                                : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                        }`}
                    >
                        Dashboard
                    </button>
                </nav>

                {/* User Progress Indicator */}
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <div className="text-sm opacity-90">Level {userData.level}</div>
                        <div className="text-xs opacity-75">
                            {totalCharactersLearned} characters learned
                        </div>
                    </div>
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-lg"></i>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;