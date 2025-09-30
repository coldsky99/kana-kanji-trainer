import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    onAuthStateChanged, 
    signOut as firebaseSignOut, 
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
        console.log("[Auth] Initializing and setting persistence...");
    
        setPersistence(auth, browserLocalPersistence)
            .catch((error) => {
                console.error("[Auth] Error setting persistence:", error);
            });
        
        console.log("[Auth] Setting up onAuthStateChanged listener...");
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("[Auth] State changed:", currentUser ? currentUser.uid : null);
            setUser(currentUser);

            // Set loading to false on the first auth state check.
            if (loading) {
                console.log("[Auth] Loading complete.");
                setLoading(false);
            }
        });

        return () => {
            console.log("[Auth] Unsubscribing from auth state changes.");
            unsubscribe();
        };
    }, []); // Run only once on mount

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
