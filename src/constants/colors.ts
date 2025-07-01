// src/constants/colors.ts

export interface AppColors {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  white: string;
  black: string;
  gray: string;
  primaryText?: string;
  secondaryText?: string;
  tertiaryText?: string;
  accent?: string;
  warning?: string;
  textPrimary?: string;
  textTertiary?: string;
}

const COLORS: AppColors = {
  primary: '#6F3FF5',
  secondary: '#845EF7',
  accent: '#FF6B00',
  success: '#22C55E',
  error: '#EF4444',
  warning: '#FACC15',
  background: '#F7F8FC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  text: '#1E293B',
  textSecondary: '#64748B',
  textPrimary: '#1E293B',
  textTertiary: '#94A3B8',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#808080',
};

export default COLORS;
