import { useState, CSSProperties } from 'react';

interface InputProps {
  label:           string;
  value:           string;
  onChange:        (v: string) => void;
  placeholder?:    string;
  type?:           string;
  error?:          string;
}

export const Input = ({ label, value, onChange, placeholder, type = 'text', error }: InputProps) => {
  const [focused, setFocused] = useState(false);

  const inputStyle: CSSProperties = {
    width: '100%', height: 52, borderRadius: 14, fontSize: 15,
    padding: '0 16px', outline: 'none', boxSizing: 'border-box',
    background: '#F7F8FF', color: '#1E1E2E',
    border: `1.5px solid ${error ? '#EF4444' : focused ? '#5B5FEF' : '#DDE3FF'}`,
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#4A4A6A', letterSpacing: '0.3px' }}>
        {label}
      </label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        style={inputStyle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error && <span style={{ fontSize: 12, color: '#EF4444' }}>{error}</span>}
    </div>
  );
};
