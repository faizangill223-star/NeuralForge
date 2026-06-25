import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import AuthModal from './AuthModal';

interface AuthModalContextValue {
  openAuth: (mode?: 'signin' | 'signup') => void;
  closeAuth: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const openAuth = useCallback((m: 'signin' | 'signup' = 'signin') => {
    setMode(m);
    setOpen(true);
  }, []);

  const closeAuth = useCallback(() => setOpen(false), []);

  return (
    <AuthModalContext.Provider value={{ openAuth, closeAuth }}>
      {children}
      <AuthModal open={open} onClose={closeAuth} initialMode={mode} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error('useAuthModal must be used within AuthModalProvider');
  return ctx;
}
