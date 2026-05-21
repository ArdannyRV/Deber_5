import { useState } from 'react';
import { supabase } from '@/src/shared/api/supabase';

export function useChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const changePassword = async (newPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: err } = await supabase.auth.updateUser({ password: newPassword });
      if (err) throw err;
      setIsSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return { changePassword, isLoading, error, isSuccess };
}
