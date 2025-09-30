import React, { useState, type FormEvent } from 'react';
import { 
    GoogleAuthProvider, 
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    type AuthError
} from 'firebase/auth';
import { auth } from '../firebase';
import { useLocalization } from '../hooks/useLocalization';

const LoginView: React.FC = () => {
    const { t } = useLocalization();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error during Google sign-in:", error);
        }
    };
    
    const handleAuthAction = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError(t('login.error.invalidEmail'));
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError(t('login.error.passwordTooShort'));
            setLoading(false);
            return;
        }

        try {
            if (mode === 'register') {
                if (password !== confirmPassword) {
                    setError(t('login.error.passwordsDoNotMatch'));
                    return;
                }
                await createUserWithEmailAndPassword(auth, email, password);
            } else { // Login mode
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            const authError = err as AuthError;
            let errorMessage: string;
            switch (authError.code) {
                case 'auth/email-already-in-use':
                    errorMessage = t('login.error.auth/email-already-in-use');
                    break;
                case 'auth/invalid-credential':
                    errorMessage = t('login.error.auth/invalid-credential');
                    break;
                case 'auth/weak-password':
                    errorMessage = t('login.error.auth/weak-password');
                    break;
                default:
                    errorMessage = t('login.error.default');
                    console.error("Firebase Auth Error:", authError);
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl">
                <div className="text-center">
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

                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">{t('login.divider')}</span>
                    </div>
                </div>

                <form onSubmit={handleAuthAction} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">{t('login.emailLabel')}</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                            placeholder={t('login.emailLabel')}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">{t('login.passwordLabel')}</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                            placeholder={t('login.passwordLabel')}
                        />
                    </div>
                    {mode === 'register' && (
                        <div>
                            <label htmlFor="confirm-password" className="sr-only">{t('login.confirmPasswordLabel')}</label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                                placeholder={t('login.confirmPasswordLabel')}
                            />
                        </div>
                    )}
                    {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded-md">
                            <p className="text-sm text-red-700 dark:text-red-300 text-center">{error}</p>
                        </div>
                    )}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : (mode === 'login' ? t('login.signInButton') : t('login.createAccountButton'))}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    {mode === 'login' ? t('login.toggleToRegisterPrompt') : t('login.toggleToLoginPrompt')}{' '}
                    <button
                        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        {mode === 'login' ? t('login.toggleToRegisterLink') : t('login.toggleToLoginLink')}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginView;
