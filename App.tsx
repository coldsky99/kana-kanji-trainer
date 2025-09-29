import React, { useState } from 'react';
import { UserDataProvider } from './hooks/useUserData';
import { LocalizationProvider, useLocalization } from './hooks/useLocalization';
import Dashboard from './components/Dashboard';
import KanaView from './components/KanaView';
import KanjiView from './components/KanjiView';
import WordBuilderView from './components/WordBuilderView';
import SentenceView from './components/SentenceView';
import { KanaType, AppView } from './types';
import Header from './components/Header';

const AppContent: React.FC = () => {
    const [currentView, setCurrentView] = useState<AppView>(AppView.Dashboard);
    const { t } = useLocalization();

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
        <div className="min-h-screen flex flex-col font-sans">
            <Header currentView={currentView} setView={setCurrentView} />
            <main className="flex-grow container mx-auto p-4 md:p-8">
                {renderView()}
            </main>
            <footer className="text-center p-4 text-xs text-slate-500 dark:text-slate-400">
                <p>{t('footer.message')}</p>
            </footer>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <LocalizationProvider>
            <UserDataProvider>
                <AppContent />
            </UserDataProvider>
        </LocalizationProvider>
    );
};


export default App;