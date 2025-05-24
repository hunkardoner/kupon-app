// src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { AppTheme } from '../../theme/theme';
import ErrorDisplay from './ErrorDisplay';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

const ErrorContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${(props: { theme: AppTheme }) => props.theme.spacing.lg}px;
  background-color: ${(props: { theme: AppTheme }) => props.theme.colors.background};
`;

const ErrorTitle = styled(Text)`
  font-size: ${(props: { theme: AppTheme }) => props.theme.typography.sizes.xl}px;
  font-weight: ${(props: { theme: AppTheme }) => props.theme.typography.weights.bold};
  color: ${(props: { theme: AppTheme }) => props.theme.colors.error};
  text-align: center;
  margin-bottom: ${(props: { theme: AppTheme }) => props.theme.spacing.md}px;
`;

const ErrorMessage = styled(Text)`
  font-size: ${(props: { theme: AppTheme }) => props.theme.typography.sizes.md}px;
  color: ${(props: { theme: AppTheme }) => props.theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${(props: { theme: AppTheme }) => props.theme.spacing.lg}px;
  line-height: 24px;
`;

const RetryButton = styled(TouchableOpacity)`
  background-color: ${(props: { theme: AppTheme }) => props.theme.colors.primary};
  padding-horizontal: ${(props: { theme: AppTheme }) => props.theme.spacing.lg}px;
  padding-vertical: ${(props: { theme: AppTheme }) => props.theme.spacing.md}px;
  border-radius: ${(props: { theme: AppTheme }) => props.theme.borders.radius.md}px;
`;

const RetryButtonText = styled(Text)`
  color: ${(props: { theme: AppTheme }) => props.theme.colors.white};
  font-size: ${(props: { theme: AppTheme }) => props.theme.typography.sizes.lg}px;
  font-weight: ${(props: { theme: AppTheme }) => props.theme.typography.weights.semiBold};
`;

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log to error reporting service (Sentry, Crashlytics, etc.)
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);

    // In production, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorDisplay
            error={this.state.error}
            onRetry={this.handleRetry}
            message="Uygulama beklenmedik bir hatayla karşılaştı. Lütfen uygulamayı yeniden başlatmayı deneyin."
            retryText="Tekrar Dene"
            fullScreen={true}
          />
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
