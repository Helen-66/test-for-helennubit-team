import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signUpWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithProvider: (provider: 'github' | 'google') => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<Profile, 'nickname' | 'avatar_url' | 'bio'>>) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
  });

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    const profile = await fetchProfile(state.user.id);
    if (profile) {
      setState((prev) => ({ ...prev, profile }));
    }
  }, [state.user, fetchProfile]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id).then((profile) => {
          setState({ user: session.user, session, profile, loading: false });
        });
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const profile = session?.user ? await fetchProfile(session.user.id) : null;
      setState({
        user: session?.user ?? null,
        session,
        profile,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signInWithProvider = useCallback(async (provider: 'github' | 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ user: null, session: null, profile: null, loading: false });
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<Pick<Profile, 'nickname' | 'avatar_url' | 'bio'>>) => {
      if (!state.user) return { error: new Error('Not authenticated') };
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', state.user.id);
      if (!error) {
        setState((prev) => ({
          ...prev,
          profile: prev.profile ? { ...prev.profile, ...updates } : null,
        }));
      }
      return { error: error ? new Error(error.message) : null };
    },
    [state.user],
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUpWithEmail,
        signInWithEmail,
        signInWithProvider,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
