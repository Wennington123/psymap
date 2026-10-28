import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from '@react-native-firebase/auth';
import { IS_FOSS } from '../lib/config';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signInWithGoogle: async () => null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // No flavor `foss` (F-Droid) não há conta: pronto imediatamente, user = null.
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!IS_FOSS);

  useEffect(() => {
    if (IS_FOSS) {
      setLoading(false);
      return;
    }
    let unsub: (() => void) | undefined;
    let active = true;
    (async () => {
      const { initAuth } = await import('../lib/firebase/auth');
      if (!active) return;
      unsub = initAuth(
        (u) => {
          if (active) setUser(u);
        },
        () => {
          if (active) setLoading(false);
        },
      );
    })();
    return () => {
      active = false;
      unsub?.();
    };
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<User | null> => {
    if (IS_FOSS) return null;
    const { signInWithGoogle: signIn } = await import('../lib/firebase/auth');
    return signIn();
  }, []);

  const signOut = useCallback(async () => {
    if (IS_FOSS) return;
    const { signOut: so } = await import('../lib/firebase/auth');
    await so();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
