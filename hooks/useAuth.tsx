import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Deklarasi tipe global untuk objek netlifyIdentity
declare global {
  interface Window {
    netlifyIdentity: any;
  }
}

// Tipe untuk pengguna dari Netlify Identity
export interface NetlifyUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
    avatar_url: string;
  };
  token: {
    access_token: string;
  };
}

interface AuthContextType {
  user: NetlifyUser | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<NetlifyUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.on('init', (user: NetlifyUser | null) => {
        setUser(user);
        setLoading(false);
        setIsInitialized(true);
      });
      
      window.netlifyIdentity.on('login', (user: NetlifyUser) => {
        setUser(user);
        window.netlifyIdentity.close();
      });

      window.netlifyIdentity.on('logout', () => {
        setUser(null);
      });
      
      window.netlifyIdentity.init();
    } else {
        console.warn("Netlify Identity widget not found.");
        setLoading(false);
        setIsInitialized(true);
    }

    return () => {
      if (window.netlifyIdentity) {
        window.netlifyIdentity.off('login');
        window.netlifyIdentity.off('logout');
      }
    };
  }, []);

  const login = useCallback(() => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.open();
    }
  }, []);

  const logout = useCallback(() => {
    if (window.netlifyIdentity) {
      window.netlifyIdentity.logout();
    }
  }, []);

  const value = { user, loading, login, logout, isInitialized };

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
