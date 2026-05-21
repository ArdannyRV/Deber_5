import { useState } from 'react';
import { supabase } from '@/src/shared/api/supabase';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (err) {
      setError(err.message);
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      setIsLoading(false);
    }
  };

  return { register, isLoading, error, isSuccess };
}
