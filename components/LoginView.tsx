import React from 'react';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { auth } from '../firebase';
import { useLocalization } from '../hooks/useLocalization';

const LoginView: React.FC = () => {
    const { t } = useLocalization();

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithRedirect(auth, provider);
        } catch (error) {
            console.error("Error during Google sign-in:", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="w-full max-w-sm p-8 space-y-8 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl text-center">
                <div className="flex flex-col items-center">
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

                <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-300"
                >
                    <svg className="w-6 h-6" viewBox="0 0 48 48">
                        <path fill="#4285F4" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
                        <path fill="#34A853" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
                        <path fill="#FBBC05" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
                        <path fill="#EA4335" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.596 44 30.033 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
                    </svg>
                    <span className="text-lg font-medium text-slate-700 dark:text-slate-200">{t('login.googleButton')}</span>
                </button>
            </div>
        </div>
    );
};

export default LoginView;