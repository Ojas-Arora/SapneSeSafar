import { create } from 'zustand';
import { auth, profiles, supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface AuthStore {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  error: null,
  initialized: false,

  initialize: async () => {
    try {
      const { data: sessionData, error: sessionError } = await auth.getSession();
      
      // If there's an error getting the session or no valid user, clear any stale session data
      if (sessionError || !sessionData?.user) {
        await auth.signOut();
        set({ user: null, profile: null, initialized: true });
        return;
      }

      // If we have a valid session, set the user and fetch profile
      if (sessionData?.user) {
        set({ user: sessionData.user });
        await get().fetchProfile();
      }
      
      set({ initialized: true });
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Clear any stale session data on error
      try {
        await auth.signOut();
      } catch (signOutError) {
        console.error('Error clearing stale session:', signOutError);
      }
      set({ user: null, profile: null, initialized: true });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        set({ user: data.user });
        await get().fetchProfile();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await auth.signUp(email, password, fullName);
      
      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        set({ user: data.user });
        // Profile will be created automatically by the trigger
        await get().fetchProfile();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      set({ user: null, profile: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const { data, error } = await profiles.get(user.id);
      if (error && error.code !== 'PGRST116') { // Not found error
        throw new Error(error.message);
      }
      set({ profile: data, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
      set({ error: errorMessage });
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const { user } = get();
    if (!user) return;

    set({ loading: true, error: null });
    try {
      const { data, error } = await profiles.update(user.id, {
        ...updates,
        updated_at: new Date().toISOString(),
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      set({ profile: data });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  const store = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' && session?.user) {
    useAuthStore.setState({ user: session.user });
    store.fetchProfile();
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, profile: null });
  }
});