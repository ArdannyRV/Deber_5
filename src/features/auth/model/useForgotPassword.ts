import { useState } from 'react';
import { supabase } from '@/src/shared/api/supabase';

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const sendReset = async (email: string) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    const redirectTo = `${process.env.EXPO_PUBLIC_WEB_URL ?? 'https://auth-ruddy-three.vercel.app'}/reset-password`;

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (err) {
      setError(err.message);
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      setIsLoading(false);
    }
  };

  return { sendReset, isLoading, error, isSuccess };
}
