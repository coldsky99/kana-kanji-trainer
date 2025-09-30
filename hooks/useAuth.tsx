import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { getRedirectResult, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
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
    let isMounted = true;
    console.log('[Auth] AuthProvider mounted. Checking auth state...');

    // onAuthStateChanged is the primary listener for auth state.
    // It fires on initial load (with cached user or null) and whenever state changes.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!isMounted) return;
      console.log('[Auth] onAuthStateChanged fired. User state is:', currentUser ? currentUser.uid : 'null');
      setUser(currentUser);
      // The loading state will be managed by the getRedirectResult promise
      // to avoid race conditions on redirect.
    });

    // Process any pending redirect results.
    // This promise must be handled to know when the auth state is stable after a redirect.
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
            console.log("[Auth] getRedirectResult processed. User found:", result.user.uid);
        } else {
            console.log("[Auth] getRedirectResult processed. No user from redirect.");
        }
      })
      .catch((error) => {
        console.error("[Auth] Error processing sign-in redirect:", error);
      })
      .finally(() => {
        // This block runs after the redirect check is complete.
        // By this point, onAuthStateChanged has fired with the definitive user state.
        // We can now confidently say the initial auth process is finished.
        if (isMounted) {
            console.log('[Auth] Auth initialization complete. Setting auth loading to false.');
            setLoading(false);
        }
      });

    return () => {
      console.log('[Auth] AuthProvider unmounting. Cleaning up auth listener.');
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
        await firebaseSignOut(auth);
    } catch(error) {
        console.error("Error signing out: ", error);
    }
  };

  const value = { user, loading, signOut };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};