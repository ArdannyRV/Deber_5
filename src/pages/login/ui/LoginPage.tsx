import { useState } from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AnimatedBackground from '@/src/shared/ui/AnimatedBackground';
import Input from '@/src/shared/ui/Input';
import Button from '@/src/shared/ui/Button';
import { useLogin } from '@/src/features/auth/model/useLogin';
import { useGoogleLogin } from '@/src/features/auth/model/useGoogleLogin';
import { theme } from '@/src/core/styles/theme';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useLogin();
  const { googleLogin, isLoading: googleLoading, error: googleError } = useGoogleLogin();

  const handleLogin = async () => {
    const ok = await login(email, password);
    if (ok) router.replace('/home');
  };

  const handleGoogle = async () => {
    const ok = await googleLogin();
    if (ok) router.replace('/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.bg} />
      <AnimatedBackground />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>📦</Text>
            </View>
            <Text style={styles.appTitle}>Activity Container</Text>
            <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>
          </View>

          {error || googleError ? (
            <Text style={styles.apiError}>{error ?? googleError}</Text>
          ) : null}

          <Input label="Correo electrónico" value={email} onChangeText={setEmail} placeholder="tu@correo.com" keyboardType="email-address" autoCapitalize="none" />
          <Input label="Contraseña" value={password} onChangeText={setPassword} placeholder="Ingresa tu contraseña" isPassword />

          <View style={styles.btnPad} />

          <Button label="Iniciar Sesión" onPress={handleLogin} isLoading={isLoading} />

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotLink}>
            <Text style={styles.forgotLinkText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleBtn} onPress={handleGoogle} disabled={googleLoading} activeOpacity={0.8}>
            {googleLoading ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color="#4285F4" />
                <Text style={styles.googleLabel}>Continuar con Google</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.bg },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 28 },
  logoSection: { alignItems: 'center', marginBottom: 36 },
  logoCircle: {
    backgroundColor: '#EEF0FF',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.card,
  },
  logoEmoji: { fontSize: 52 },
  appTitle: { fontSize: 30, fontWeight: '800', color: theme.colors.primary, marginTop: 16 },
  subtitle: { fontSize: 15, color: theme.colors.textMid, marginTop: 6 },
  apiError: {
    backgroundColor: '#FEF2F2',
    color: theme.colors.danger,
    padding: 12,
    borderRadius: theme.radius.sm,
    marginBottom: 16,
    fontSize: 13,
    textAlign: 'center',
    overflow: 'hidden',
  },
  btnPad: { height: 8 },
  forgotLink: { alignItems: 'center', marginTop: 12, marginBottom: 4 },
  forgotLinkText: { color: theme.colors.primary, fontSize: 14, fontWeight: '500' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  dividerText: { marginHorizontal: 12, color: theme.colors.textMuted, fontSize: 13 },
  googleBtn: {
    flexDirection: 'row',
    height: 52,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    width: '100%',
    gap: 10,
  },
  googleLabel: { fontSize: 16, fontWeight: '700', color: theme.colors.primary },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: theme.colors.textMid, fontSize: 14 },
  footerLink: { color: theme.colors.primary, fontSize: 14, fontWeight: '600' },
});
