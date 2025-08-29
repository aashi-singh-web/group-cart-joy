import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  display_name?: string;
}

interface UserContextType {
  user: User | null;
  createUser: (displayName?: string) => Promise<User>;
  updateDisplayName: (name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem('shopsync_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const createUser = async (displayName?: string): Promise<User> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({ display_name: displayName })
        .select()
        .single();

      if (error) throw error;

      const newUser = { id: data.id, display_name: data.display_name };
      setUser(newUser);
      localStorage.setItem('shopsync_user', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const updateDisplayName = async (name: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ display_name: name })
        .eq('id', user.id);

      if (error) throw error;

      const updatedUser = { ...user, display_name: name };
      setUser(updatedUser);
      localStorage.setItem('shopsync_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating display name:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, createUser, updateDisplayName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};