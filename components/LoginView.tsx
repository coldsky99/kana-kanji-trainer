import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';

const LoginView: React.FC = () => {
  const { t } = useLocalization();
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl text-center">
        <div>
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-12 bg-red-500 rounded-md flex items-center justify-center relative overflow-hidden mb-4">
               <div className="absolute inset-0 bg-white">
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-500 rounded-full"></div>
               </div>
             </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Nihongo Master</h1>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">{t('login.title')}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">{t('login.subtitle')}</p>
          </div>
        </div>

        <button
          onClick={login}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {t('login.signInButton')} / {t('login.toggleToRegisterLink')}
        </button>
      </div>
    </div>
  );
};

export default LoginView;
