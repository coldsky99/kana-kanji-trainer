import React, { createContext, useContext, useState, useEffect } from 'react';
// Fix: Use Firebase v9 compat imports to support v8 syntax.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from '../firebase'; 

// Fix: Define types for Firebase v8
type User = firebase.User;
type AuthError = firebase.auth.AuthError;

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
    
        // Fix: Use v8 syntax for setPersistence
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .catch((error: AuthError) => {
                console.error("[Auth] Error setting persistence:", error.code, error.message);
            });
        
        console.log("[Auth] Setting up onAuthStateChanged listener...");
        // Fix: Use v8 syntax for onAuthStateChanged
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
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
            // Fix: Use v8 syntax for signOut
            await auth.signOut();
        } catch (error) {
            const authError = error as AuthError;
            console.error("Error signing out:", authError.code, authError.message);
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