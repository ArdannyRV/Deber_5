import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '@/tamagui.config';
import QueryProvider from '@/src/core/providers/QueryProvider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        <QueryProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="home" />
            <Stack.Screen name="change-password" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="dark" backgroundColor="#FFFFFF" />
        </QueryProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
