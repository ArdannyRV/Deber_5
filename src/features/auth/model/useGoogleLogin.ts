import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/src/shared/api/supabase';
import * as Linking from 'expo-linking';

export function useGoogleLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const googleLogin = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const redirectTo = Linking.createURL('/');

      const { data, error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
      });

      if (oauthErr) {
        setError(oauthErr.message);
        setIsLoading(false);
        return false;
      }

      if (!data?.url) {
        setError('No OAuth URL returned');
        setIsLoading(false);
        return false;
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (result.type === 'success' && result.url) {
        const fragmentParams = new URLSearchParams(
          result.url.split('#')[1] ?? ''
        );
        const accessToken = fragmentParams.get('access_token');
        const refreshToken = fragmentParams.get('refresh_token');

        if (!accessToken) {
          setIsLoading(false);
          return false;
        }

        const { error: sessionErr } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken ?? '',
        });

        if (sessionErr) {
          setError(sessionErr.message);
          setIsLoading(false);
          return false;
        }

        setIsLoading(false);
        return true;
      }

      if (result.type !== 'success') {
        setError('Google sign-in was cancelled');
      }

      setIsLoading(false);
      return false;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
      setIsLoading(false);
      return false;
    }
  };

  return { googleLogin, isLoading, error };
}
