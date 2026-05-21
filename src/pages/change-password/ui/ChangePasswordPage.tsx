import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AnimatedBackground from '@/src/shared/ui/AnimatedBackground';
import Input from '@/src/shared/ui/Input';
import Button from '@/src/shared/ui/Button';
import { useChangePassword } from '@/src/features/auth/model/useChangePassword';
import { theme } from '@/src/core/styles/theme';

export default function ChangePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { changePassword, isLoading, error, isSuccess } = useChangePassword();

  const handleSave = async () => {
    setLocalError(null);

    if (!password.trim() || !confirm.trim()) {
      setLocalError('Ambos campos son obligatorios');
      return;
    }

    if (password.length < 6) {
      setLocalError('Mínimo 6 caracteres');
      return;
    }

    if (password !== confirm) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    await changePassword(password);
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.bg} />
        <AnimatedBackground />
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>✅</Text>
          <Text style={styles.successTitle}>¡Contraseña actualizada!</Text>
          <Text style={styles.successText}>
            Tu contraseña ha sido cambiada correctamente.
          </Text>
          <Button label="Volver al inicio" onPress={() => router.replace('/home')} variant="ghost" />
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
          {/* Back button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🔒</Text>
            </View>
            <Text style={styles.appTitle}>Nueva contraseña</Text>
            <Text style={styles.subtitle}>Elige una contraseña segura</Text>
          </View>

          {(error || localError) && (
            <Text style={styles.apiError}>{error ?? localError}</Text>
          )}

          <Input
            label="Nueva contraseña"
            value={password}
            onChangeText={(t) => { setPassword(t); setLocalError(null); }}
            placeholder="Ingresa tu nueva contraseña"
            isPassword
          />
          <Input
            label="Confirmar contraseña"
            value={confirm}
            onChangeText={(t) => { setConfirm(t); setLocalError(null); }}
            placeholder="Repite la contraseña"
            isPassword
          />

          <View style={styles.btnPad} />

          <Button label="Guardar contraseña" onPress={handleSave} isLoading={isLoading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.bg },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 28 },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 4,
  },
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
  subtitle: { fontSize: 15, color: theme.colors.textMid, marginTop: 6, textAlign: 'center', paddingHorizontal: 16 },
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
  successEmoji: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: '800', color: theme.colors.primary, marginBottom: 8 },
  successText: { fontSize: 15, color: theme.colors.textMid, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
});
