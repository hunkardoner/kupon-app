// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { ActivityIndicator, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { AppTheme } from '../../theme/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
  fullScreen?: boolean;
  message?: string;
}

const FullScreenContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(props: { theme: AppTheme }) => props.theme.colors.background};
  padding: ${(props: { theme: AppTheme }) => props.theme.spacing.lg}px;
`;

const InlineContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: ${(props: { theme: AppTheme }) => props.theme.spacing.md}px;
`;

const LoadingMessage = styled.Text`
  margin-top: ${(props: { theme: AppTheme }) => props.theme.spacing.sm}px;
  font-size: ${(props: { theme: AppTheme }) => props.theme.typography.sizes.md}px;
  color: ${(props: { theme: AppTheme }) => props.theme.colors.textSecondary};
  text-align: center;
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
  style,
  fullScreen = false,
  message = 'Yükleniyor...'
}) => {
  const Container = fullScreen ? FullScreenContainer : InlineContainer;

  return (
    <Container style={style}>
      <ActivityIndicator 
        size={size} 
        color={color}
        accessibilityLabel="Yükleniyor"
        accessibilityRole="progressbar"
      />
      {message && <LoadingMessage>{message}</LoadingMessage>}
    </Container>
  );
};

export default LoadingSpinner;
