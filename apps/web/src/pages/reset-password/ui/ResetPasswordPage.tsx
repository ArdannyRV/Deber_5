import { CSSProperties } from 'react';
import { useResetPassword } from '../../../features/reset-password/model/useResetPassword';
import { ResetPasswordForm } from '../../../features/reset-password/ui/ResetPasswordForm';

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  background: 'var(--bg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px 16px',
};

const cardStyle: CSSProperties = {
  background: '#FFFFFF',
  borderRadius: 20,
  padding: '48px 40px',
  maxWidth: 440,
  width: '100%',
  boxShadow: '0 4px 24px rgba(91,95,239,0.10)',
  textAlign: 'center',
};

export const ResetPasswordPage = () => {
  const { status, updatePassword, isLoading, error } = useResetPassword();

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {status === 'loading' && (
          <>
            <div className="spinner" />
            <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>Validando enlace...</p>
          </>
        )}

        {status === 'ready' && (
          <>
            <div
              style={{
                width: 80,
                height: 80,
                background: '#EEF0FF',
                borderRadius: '50%',
                fontSize: 40,
                lineHeight: '80px',
                textAlign: 'center',
                margin: '0 auto',
              }}
            >
              🔑
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)', marginTop: 16 }}>
              Nueva contraseña
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-mid)', marginTop: 4, marginBottom: 28 }}>
              Elige una contraseña segura para tu cuenta
            </p>
            <ResetPasswordForm onSubmit={updatePassword} isLoading={isLoading} hookError={error} />
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: 64 }}>✅</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)', marginTop: 16 }}>
              ¡Contraseña actualizada!
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-mid)', marginTop: 8, lineHeight: 1.5 }}>
              Tu contraseña ha sido cambiada. Ya puedes iniciar sesión en la app.
            </p>
            <div
              style={{
                background: 'var(--surface-alt)',
                borderRadius: 8,
                padding: '10px 16px',
                fontSize: 13,
                color: 'var(--text-muted)',
                marginTop: 24,
              }}
            >
              Puedes cerrar esta ventana
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: 64 }}>⚠️</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--danger)', marginTop: 16 }}>
              Enlace inválido
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-mid)', marginTop: 8, lineHeight: 1.5 }}>
              Este enlace expiró o ya fue utilizado. Solicita uno nuevo desde la app.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
