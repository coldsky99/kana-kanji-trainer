import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, updateProfile, type User } from 'firebase/auth';

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
        // Use the v9 modular onAuthStateChanged function.
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const needsUpdate = !firebaseUser.displayName || !firebaseUser.photoURL;
                const reloadFlag = `reload_${firebaseUser.uid}`;
                
                if (needsUpdate && !sessionStorage.getItem(reloadFlag)) {
                    try {
                        const displayName = firebaseUser.displayName || `User${Math.floor(Math.random() * 10000)}`;
                        const photoURL = firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}`;
                        
                        // Use the v9 modular updateProfile function.
                        await updateProfile(firebaseUser, {
                            displayName,
                            photoURL,
                        });
                        
                        sessionStorage.setItem(reloadFlag, 'true');
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                        
                        // Don't update state yet, wait for reload to show updated profile
                        return;
                    } catch (error) {
                        console.error("Error updating profile:", error);
                        // Fall through to set user even if update fails
                    }
                }
                
                // Set user if profile is complete, update failed, or reload already happened
                setUser(firebaseUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSignOut = useCallback(async () => {
        try {
            // Use the v9 modular signOut function.
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }, []);

    const value = { user, loading, signOut: handleSignOut };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};