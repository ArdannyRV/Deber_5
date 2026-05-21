import { Redirect } from 'expo-router';
import { useSession } from '@/src/features/session/model/useSession';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (session) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
