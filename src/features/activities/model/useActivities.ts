import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/src/shared/api/supabase';
import type { Activity, ActivityType } from '@/src/entities/user/model/types';

async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user?.id) throw new Error('Not authenticated');
  return data.user.id;
}

export function useActivities() {
  const query = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId)
        .order('deadline', { ascending: true });

      if (error) throw error;
      return data as Activity[];
    },
  });

  return { activities: query.data ?? [], isLoading: query.isLoading, refetch: query.refetch };
}

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { type: ActivityType; subject: string; deadline: string }) => {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('activities')
        .insert({ user_id: userId, ...input })
        .select()
        .single();

      if (error) throw error;
      return data as Activity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { id: string; type?: ActivityType; subject?: string; deadline?: string }) => {
      const { data, error } = await supabase
        .from('activities')
        .update({
          ...(input.type !== undefined && { type: input.type }),
          ...(input.subject !== undefined && { subject: input.subject }),
          ...(input.deadline !== undefined && { deadline: input.deadline }),
        })
        .eq('id', input.id)
        .select()
        .single();

      if (error) throw error;
      return data as Activity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('activities').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}
