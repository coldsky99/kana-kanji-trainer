

import React from 'react';
import { UserDataProvider, useUserData } from './hooks/useUserData';
import { LocalizationProvider, useLocalization } from './hooks/useLocalization';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Header from './components/Header';
// Fix: Use default import for Dashboard component.
import Dashboard from './components/Dashboard';
import KanaView from './components/KanaView';
import KanjiView from './components/KanjiView';
import WordBuilderView from './components/WordBuilderView';
import SentenceView from './components/SentenceView';
import OnboardingModal from './components/OnboardingModal';
import { LanguageSelectionModal } from './components/LanguageSelectionModal';
import LoginView from './components/LoginView';
// Fix: Import KanaType for type casting.
import { AppView, KanaType } from './types';

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { userData, completeOnboarding, isLoading: userDataLoading } = useUserData();
  const { 
    language, 
    changeLanguage, 
    showLanguageSelection, 
    isInitialized: langInitialized,
    supportedLanguages 
  } = useLocalization();
  
  const [currentView, setCurrentView] = React.useState<AppView>(AppView.Dashboard);
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  React.useEffect(() => {
    if (langInitialized && userData && !userData.hasCompletedOnboarding && !showLanguageSelection) {
      setShowOnboarding(true);
    }
  }, [langInitialized, userData, showLanguageSelection]);

  const renderView = () => {
    switch (currentView) {
      case AppView.Hiragana:
      case AppView.Katakana:
        return (
          <KanaView
            // Fix: Cast AppView enum to KanaType enum. Their string values are compatible,
            // but the types do not overlap, so a cast to 'unknown' is required first.
            kanaType={currentView as unknown as KanaType}
          />
        );
      case AppView.Kanji:
        return <KanjiView />;
      case AppView.Words:
        return <WordBuilderView />;
      case AppView.Sentences:
        return <SentenceView />;
      default:
        return (
          <Dashboard
            setView={setCurrentView}
          />
        );
    }
  };

  const handleLanguageSelect = (lang: 'en' | 'id') => {
    changeLanguage(lang);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    completeOnboarding();
  };

  if (authLoading || userDataLoading || !langInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }
  
  if (!userData) {
      // This state can happen briefly while the user document is being created
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
            <p>Setting up your account...</p>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <Header currentView={currentView} setView={setCurrentView} />
      <main className="container mx-auto px-4 py-8">
        {renderView()}
      </main>
      
      {showLanguageSelection && (
        <LanguageSelectionModal
          onSelectLanguage={handleLanguageSelect}
          supportedLanguages={supportedLanguages}
        />
      )}
      
      {showOnboarding && userData && !userData.hasCompletedOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LocalizationProvider>
      <AuthProvider>
        <UserDataProvider>
          <AppContent />
        </UserDataProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
};

export default App;