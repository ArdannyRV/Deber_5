import { useState } from 'react';
import { supabase } from '@/src/shared/api/supabase';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const { error: err } = await supabase.auth.signInWithPassword({ email, password });

    if (err) {
      setError(err.message);
      setIsLoading(false);
      return false;
    } else {
      setIsLoading(false);
      return true;
    }
  };

  return { login, isLoading, error };
}
