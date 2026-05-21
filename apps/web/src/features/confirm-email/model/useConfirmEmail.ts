import { useEffect, useState } from 'react';
import { supabase } from '../../../shared/api/supabase';

type Status = 'loading' | 'success' | 'error';

export const useConfirmEmail = () => {
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        setStatus('error');
      } else {
        setStatus('success');
      }
    });
  }, []);

  return { status };
};
