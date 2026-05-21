import { createClient, type Session } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const CHUNK_SIZE = 1800;
const STORAGE_KEY_PREFIX = 'supabase_token_';

function createSecureStoreAdapter() {
  const isWeb = Platform.OS === 'web';
  if (isWeb) {
    return {
      getItem: async (key: string) => localStorage.getItem(key),
      setItem: async (key: string, value: string) => { localStorage.setItem(key, value); },
      removeItem: async (key: string) => { localStorage.removeItem(key); },
    };
  }

  return {
    getItem: async (key: string) => {
      try {
        const value = await SecureStore.getItemAsync(key);
        if (!value) {
          const stored = await SecureStore.getItemAsync(`${key}_chunks`);
          if (!stored) return null;
          const chunkKeys = JSON.parse(stored) as string[];
          const chunks = await Promise.all(
            chunkKeys.map((ck) => SecureStore.getItemAsync(ck))
          );
          if (chunks.some((c) => c === null)) return null;
          return chunks.join('');
        }
        return value;
      } catch {
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        if (value.length <= CHUNK_SIZE) {
          await SecureStore.setItemAsync(key, value);
          return;
        }
        const chunkKeys: string[] = [];
        for (let i = 0; i < value.length; i += CHUNK_SIZE) {
          const ck = `${STORAGE_KEY_PREFIX}${key}_${i}`;
          chunkKeys.push(ck);
          await SecureStore.setItemAsync(ck, value.slice(i, i + CHUNK_SIZE));
        }
        await SecureStore.setItemAsync(`${key}_chunks`, JSON.stringify(chunkKeys));
      } catch {}
    },
    removeItem: async (key: string) => {
      try {
        const stored = await SecureStore.getItemAsync(`${key}_chunks`);
        if (stored) {
          const chunkKeys = JSON.parse(stored) as string[];
          await Promise.all(chunkKeys.map((ck) => SecureStore.deleteItemAsync(ck)));
          await SecureStore.deleteItemAsync(`${key}_chunks`);
        }
        await SecureStore.deleteItemAsync(key);
      } catch {}
    },
  };
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createSecureStoreAdapter(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
