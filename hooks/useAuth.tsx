import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    onAuthStateChanged, 
    signOut as firebaseSignOut, 
    getRedirectResult,
    setPersistence,
    browserLocalPersistence,
    type User 
} from 'firebase/auth';
import { auth } from '../firebase'; 

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("[Auth] Initializing...");

        let unsubscribe: () => void;

        const initializeAuth = async () => {
            try {
                console.log("[Auth] Setting persistence to LOCAL...");
                await setPersistence(auth, browserLocalPersistence);

                console.log("[Auth] Checking redirect result...");
                const result = await getRedirectResult(auth);
                console.log("[Auth] Redirect result:", result ? { uid: result.user.uid } : null);
                
                // If redirect has just happened, the user session is now set.
                // The listener below will now correctly pick up the user.

            } catch (error) {
                console.error("[Auth] Error during persistence/redirect check:", error);
            }
            
            console.log("[Auth] Setting up onAuthStateChanged listener...");
            unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                console.log("[Auth] State changed:", currentUser ? currentUser.uid : null);
                setUser(currentUser);

                // Set loading to false on the first auth state check.
                // This ensures we have a definitive user state (or null) before rendering the app.
                if (loading) {
                    console.log("[Auth] Loading complete.");
                    setLoading(false);
                }
            });
        };

        initializeAuth();

        return () => {
            if (unsubscribe) {
                console.log("[Auth] Unsubscribing from auth state changes.");
                unsubscribe();
            }
        };
    }, []); // Runs once on mount

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return React.createElement(AuthContext.Provider, { value: { user, loading, signOut } }, children);
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};