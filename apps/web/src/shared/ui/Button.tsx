import { CSSProperties, ReactNode } from 'react';

interface ButtonProps {
  onClick:    () => void;
  children:   ReactNode;
  isLoading?: boolean;
  variant?:   'primary' | 'ghost' | 'danger';
  disabled?:  boolean;
  fullWidth?: boolean;
}

const base: CSSProperties = {
  height: 52, borderRadius: 14, fontSize: 16, fontWeight: 700,
  cursor: 'pointer', border: 'none', width: '100%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'opacity 0.15s, transform 0.1s',
};

const variants: Record<string, CSSProperties> = {
  primary: { background: '#5B5FEF', color: '#fff', boxShadow: '0 4px 16px rgba(91,95,239,0.28)' },
  ghost:   { background: 'transparent', color: '#5B5FEF', border: '1.5px solid #5B5FEF' },
  danger:  { background: '#EF4444', color: '#fff', boxShadow: '0 4px 16px rgba(239,68,68,0.25)' },
};

export const Button = ({ onClick, children, isLoading, variant = 'primary', disabled }: ButtonProps) => {
  const isDisabled = disabled || isLoading;
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      style={{ ...base, ...variants[variant], opacity: isDisabled ? 0.6 : 1 }}
    >
      {isLoading ? '...' : children}
    </button>
  );
};
