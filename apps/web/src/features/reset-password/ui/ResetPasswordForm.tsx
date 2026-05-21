import { useState, CSSProperties } from 'react';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';

interface ResetPasswordFormProps {
  onSubmit:      (password: string) => Promise<void>;
  isLoading:     boolean;
  hookError:     string | null;
}

export const ResetPasswordForm = ({ onSubmit, isLoading, hookError }: ResetPasswordFormProps) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = () => {
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

    onSubmit(password);
  };

  const displayError = localError ?? hookError;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left' } as CSSProperties}>
      <Input
        label="Nueva contraseña"
        value={password}
        onChange={(v) => { setPassword(v); setLocalError(null); }}
        placeholder="Ingresa tu nueva contraseña"
        type="password"
      />
      <Input
        label="Confirmar contraseña"
        value={confirm}
        onChange={(v) => { setConfirm(v); setLocalError(null); }}
        placeholder="Repite la contraseña"
        type="password"
      />

      {displayError && (
        <span style={{ fontSize: 13, color: '#EF4444', textAlign: 'center' }}>{displayError}</span>
      )}

      <Button onClick={handleSubmit} isLoading={isLoading}>
        Guardar nueva contraseña
      </Button>
    </div>
  );
};
