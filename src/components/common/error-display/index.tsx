import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppTheme } from '../../../theme/theme';

interface ErrorDisplayProps {
  error?: Error | string;
  onRetry?: () => void;
  message?: string;
  retryText?: string;
  showRetryButton?: boolean;
  fullScreen?: boolean;
}

const FullScreenContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${(props: { theme: AppTheme }) => props.theme.spacing.lg}px;
  background-color: ${(props: { theme: AppTheme }) => props.theme.colors.background};
`;

const InlineContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: ${(props: { theme: AppTheme }) => props.theme.spacing.lg}px;
`;

const ErrorIcon = styled(Ionicons)`
  margin-bottom: ${(props: { theme: AppTheme }) => props.theme.spacing.md}px;
`;

const ErrorTitle = styled.Text`
  font-size: ${(props: { theme: AppTheme }) => props.theme.typography.sizes.lg}px;
  font-weight: ${(props: { theme: AppTheme }) => props.theme.typography.weights.semiBold};
  color: ${(props: { theme: AppTheme }) => props.theme.colors.error};
  text-align: center;
  margin-bottom: ${(props: { theme: AppTheme }) => props.theme.spacing.sm}px;
`;

const ErrorMessage = styled.Text`
  font-size: ${(props: { theme: AppTheme }) => props.theme.typography.sizes.md}px;
  color: ${(props: { theme: AppTheme }) => props.theme.colors.textSecondary};
  text-align: center;
  line-height: 22px;
  margin-bottom: ${(props: { theme: AppTheme }) => props.theme.spacing.lg}px;
`;

const RetryButton = styled(TouchableOpacity)`
  background-color: ${(props: { theme: AppTheme }) => props.theme.colors.primary};
  padding-horizontal: ${(props: { theme: AppTheme }) => props.theme.spacing.lg}px;
  padding-vertical: ${(props: { theme: AppTheme }) => props.theme.spacing.md}px;
  border-radius: ${(props: { theme: AppTheme }) => props.theme.borders.radius.md}px;
  flex-direction: row;
  align-items: center;
`;

const RetryButtonText = styled.Text`
  color: ${(props: { theme: AppTheme }) => props.theme.colors.white};
  font-size: ${(props: { theme: AppTheme }) => props.theme.typography.sizes.md}px;
  font-weight: ${(props: { theme: AppTheme }) => props.theme.typography.weights.semiBold};
  margin-left: ${(props: { theme: AppTheme }) => props.theme.spacing.xs}px;
`;

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  message,
  retryText = 'Tekrar Dene',
  showRetryButton = true,
  fullScreen = false,
}) => {
  const Container = fullScreen ? FullScreenContainer : InlineContainer;
  
  const errorMessage = message || 
    (error instanceof Error ? error.message : typeof error === 'string' ? error : 'Bilinmeyen bir hata oluştu');

  return (
    <Container>
      <ErrorIcon 
        name="alert-circle-outline" 
        size={48} 
        color="#EF4444"
      />
      <ErrorTitle>Bir Hata Oluştu</ErrorTitle>
      <ErrorMessage>{errorMessage}</ErrorMessage>
      {showRetryButton && onRetry && (
        <RetryButton onPress={onRetry}>
          <Ionicons name="refresh-outline" size={20} color="white" />
          <RetryButtonText>{retryText}</RetryButtonText>
        </RetryButton>
      )}
    </Container>
  );
};

export default ErrorDisplay;
