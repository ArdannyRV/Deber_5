import { useState, useEffect } from 'react';
import { supabase } from '../../../shared/api/supabase';

type Status = 'loading' | 'ready' | 'success' | 'error';

export const useResetPassword = () => {
  const [status, setStatus] = useState<Status>('loading');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setStatus('ready');
    });

    const t = setTimeout(() => {
      setStatus(prev => prev === 'loading' ? 'error' : prev);
    }, 5000);

    return () => {
      listener?.subscription.unsubscribe();
      clearTimeout(t);
    };
  }, []);

  const updatePassword = async (newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setStatus('success');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al actualizar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return { status, updatePassword, isLoading, error };
};
