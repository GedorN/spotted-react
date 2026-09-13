import { Platform } from 'react-native';

// Tokens da identidade "7a" (Spotted - Mapa de Telas.dc.html).
export const colors = {
  brand: '#F6C500',
  sheet: '#FFFDF5',
  ink: '#111111',
  muted: '#4A4740',
  placeholder: '#8A8577',
  border: '#CFC9B8',
  borderSoft: '#E2DDCB',
  surfaceSoft: '#F2EEE0',
  error: '#C6452A',
  overlay: 'rgba(17,17,17,0.55)',
  brandTint: 'rgba(17,17,17,0.06)',
};

export const fonts = {
  // Sora/Roboto do design ainda nao estao linkadas; usamos as fontes do sistema.
  heading: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  body: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
};

export const radius = {
  sheet: 28,
  button: 14,
  modal: 22,
};

export const spacing = {
  sheetX: 36,
  headerX: 24,
};
