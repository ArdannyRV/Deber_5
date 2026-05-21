import { CSSProperties } from 'react';
import { useConfirmEmail } from '../../../features/confirm-email/model/useConfirmEmail';

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

export const ConfirmEmailPage = () => {
  const { status } = useConfirmEmail();

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {status === 'loading' && (
          <>
            <div className="spinner" />
            <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>Verificando tu cuenta...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: 64 }}>✅</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)', marginTop: 16 }}>
              ¡Cuenta confirmada!
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-mid)', marginTop: 8, lineHeight: 1.5 }}>
              Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesión en la app.
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
            <div style={{ fontSize: 64 }}>❌</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--danger)', marginTop: 16 }}>
              Error al confirmar
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-mid)', marginTop: 8, lineHeight: 1.5 }}>
              El enlace puede haber expirado o ya fue usado. Intenta registrarte de nuevo.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
