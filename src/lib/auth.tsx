import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  full_name: string;
  is_premium: boolean;
  signup_date: string;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isPremium: boolean;
  profile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  grantPremium: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const PREMIUM_KEY = 'neuralforge_premium';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, is_premium, signup_date')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        if (data.is_premium) {
          setIsPremium(true);
          sessionStorage.setItem(PREMIUM_KEY, 'true');
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        loadProfile(data.session.user.id);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setIsPremium(false);
      }
    });

    const stored = sessionStorage.getItem(PREMIUM_KEY);
    if (stored === 'true') setIsPremium(true);

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName || '' } },
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem(PREMIUM_KEY);
    setIsPremium(false);
    setProfile(null);
  };

  const grantPremium = () => {
    sessionStorage.setItem(PREMIUM_KEY, 'true');
    setIsPremium(true);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, isPremium, profile, signIn, signUp, signOut, grantPremium, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
