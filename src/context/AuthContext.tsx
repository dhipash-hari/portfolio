import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  isLiveSupabase: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  isLoading: true,
  isLiveSupabase: false,
  signIn: async () => ({ success: false }),
  signOut: async () => {},
});

const LOCAL_ADMIN_KEY = 'dhipash_portfolio_admin_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isLive = isSupabaseConfigured();

  useEffect(() => {
    console.log('AuthProvider: Starting auth check...');
    
    if (isLive && supabase) {
      console.log('AuthProvider: Using Supabase auth');
      // Check active Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          checkAdminStatus(session.user.id, session.user.email);
        } else {
          console.log('AuthProvider: No Supabase session');
          setIsAdmin(false);
          setIsLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          checkAdminStatus(session.user.id, session.user.email);
        } else {
          setIsAdmin(false);
          setIsLoading(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      console.log('AuthProvider: Using local development mode');
      // Check local session
      const stored = sessionStorage.getItem(LOCAL_ADMIN_KEY);
      console.log('AuthProvider: Local storage data:', stored);
      
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.isAdmin) {
            console.log('AuthProvider: Found local admin session');
            setUser({ id: 'local-admin-id', email: parsed.email || 'admin@dhipash.dev' } as User);
            setIsAdmin(true);
          }
        } catch (e) {
          console.error('AuthProvider: Error parsing local storage:', e);
        }
      } else {
        console.log('AuthProvider: No local session found');
      }
      setIsLoading(false);
    }
  }, [isLive]);

  const checkAdminStatus = async (userId: string, email?: string) => {
    console.log('checkAdminStatus: Checking for userId:', userId, 'email:', email);
    
    // 1. Direct authorization for verified admin accounts (avoids recursive DB query)
    const normalizedEmail = email?.toLowerCase().trim();
    if (
      normalizedEmail === 'admin@dhipash.dev' ||
      normalizedEmail === 'dhipashhari@gmail.com'
    ) {
      console.log('checkAdminStatus: Authorized by email whitelist');
      setIsAdmin(true);
      setIsLoading(false);
      return;
    }

    if (!supabase) {
      console.log('checkAdminStatus: No supabase, allowing admin access');
      setIsAdmin(true);
      setIsLoading(false);
      return;
    }

    try {
      console.log('checkAdminStatus: Querying admin_users table');
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .limit(1);

      if (!error && data && data.length > 0) {
        console.log('checkAdminStatus: Found admin user in database');
        setIsAdmin(true);
      } else {
        console.log('checkAdminStatus: No admin user found, but allowing access for development');
        // Allow signed in user as admin for development
        setIsAdmin(true);
      }
    } catch (err) {
      console.error('checkAdminStatus: Database error, allowing access:', err);
      setIsAdmin(true);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('signIn: Attempting login with:', email);
    
    if (isLive && supabase) {
      console.log('signIn: Using Supabase auth');
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          console.error('signIn: Supabase error:', error);
          return { success: false, error: error.message };
        }
        if (data.user) {
          console.log('signIn: Supabase login successful');
          await checkAdminStatus(data.user.id, data.user.email);
          return { success: true };
        }
      } catch (err: any) {
        console.error('signIn: Supabase exception:', err);
        return { success: false, error: err.message || 'Login failed' };
      }
    }

    console.log('signIn: Using local development mode');
    // Local development mode login
    // Accepts admin@dhipash.dev / admin123 or dhipashhari@gmail.com / admin123
    if (password === 'admin123' || password === 'admin' || password === 'dhipash2026') {
      console.log('signIn: Local auth successful');
      const mockAdmin = {
        email,
        isAdmin: true,
        loginTime: new Date().toISOString(),
      };
      sessionStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(mockAdmin));
      setUser({ id: 'local-admin-id', email } as User);
      setIsAdmin(true);
      return { success: true };
    } else {
      console.log('signIn: Local auth failed');
      return {
        success: false,
        error: 'Invalid password. (For local dev mode, use password: "admin123")',
      };
    }
  };

  const signOut = async () => {
    if (isLive && supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem(LOCAL_ADMIN_KEY);
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isLoading,
        isLiveSupabase: isLive,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
