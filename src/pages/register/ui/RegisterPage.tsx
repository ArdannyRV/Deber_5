import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AnimatedBackground from '@/src/shared/ui/AnimatedBackground';
import Input from '@/src/shared/ui/Input';
import Button from '@/src/shared/ui/Button';
import { useRegister } from '@/src/features/auth/model/useRegister';
import { theme } from '@/src/core/styles/theme';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { register, isLoading, error, isSuccess } = useRegister();

  const handleRegister = async () => {
    setLocalError(null);
    if (!name.trim()) {
      setLocalError('El nombre es obligatorio');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setLocalError('Ingresa un correo electrónico válido');
      return;
    }
    if (password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    await register(email.trim(), password, name.trim());
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.bg} />
        <AnimatedBackground />
        <View style={styles.successContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>✉️</Text>
          </View>
          <Text style={styles.successTitle}>Revisa tu correo</Text>
          <Text style={styles.successText}>
            Enviamos un enlace de confirmación a {email}. Revisa tu bandeja de entrada para activar tu cuenta.
          </Text>
          <Button label="Volver al inicio" onPress={() => router.replace('/(auth)/login')} />
        </View>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.subtitle}>Crea tu cuenta</Text>
          </View>

          {(error || localError) ? (
            <Text style={styles.apiError}>{localError ?? error}</Text>
          ) : null}

          <Input label="Nombre" value={name} onChangeText={setName} placeholder="Tu nombre completo" autoCapitalize="words" />
          <Input label="Correo electrónico" value={email} onChangeText={setEmail} placeholder="tu@correo.com" keyboardType="email-address" autoCapitalize="none" />
          <Input label="Contraseña" value={password} onChangeText={setPassword} placeholder="Crea una contraseña" isPassword />

          <View style={styles.btnPad} />

          <Button label="Registrarse" onPress={handleRegister} isLoading={isLoading} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Inicia sesión</Text>
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
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  successTitle: { fontSize: 24, fontWeight: '700', color: theme.colors.text, marginBottom: 8, marginTop: 16 },
  successText: { fontSize: 15, color: theme.colors.textMid, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: theme.colors.textMid, fontSize: 14 },
  footerLink: { color: theme.colors.primary, fontSize: 14, fontWeight: '600' },
});
