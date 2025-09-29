import React, { useState } from 'react';
import { UserDataProvider } from './hooks/useUserData';
import Dashboard from './components/Dashboard';
import KanaView from './components/KanaView';
import KanjiView from './components/KanjiView';
import WordBuilderView from './components/WordBuilderView';
import SentenceView from './components/SentenceView';
import { KanaType, AppView } from './types';
import Header from './components/Header';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<AppView>(AppView.Dashboard);

    const renderView = () => {
        switch (currentView) {
            case AppView.Dashboard:
                return <Dashboard setView={setCurrentView} />;
            case AppView.Hiragana:
                return <KanaView kanaType={KanaType.Hiragana} />;
            case AppView.Katakana:
                return <KanaView kanaType={KanaType.Katakana} />;
            case AppView.Kanji:
                return <KanjiView />;
            case AppView.Words:
                return <WordBuilderView />;
            case AppView.Sentences:
                return <SentenceView />;
            default:
                return <Dashboard setView={setCurrentView} />;
        }
    };

    return (
        <UserDataProvider>
            <div className="min-h-screen flex flex-col font-sans">
                <Header currentView={currentView} setView={setCurrentView} />
                <main className="flex-grow container mx-auto p-4 md:p-8">
                    {renderView()}
                </main>
                <footer className="text-center p-4 text-xs text-slate-500 dark:text-slate-400">
                    <p>Nihongo Master - Your journey to fluency starts here.</p>
                </footer>
            </div>
        </UserDataProvider>
    );
};

export default App;
