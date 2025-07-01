// src/hooks/useErrorHandler.ts
import { useCallback } from 'react';
import { Alert } from 'react-native';

interface UseErrorHandlerOptions {
  showAlert?: boolean;
  defaultMessage?: string;
  onError?: (error: Error) => void;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const {
    showAlert = true,
    defaultMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.',
    onError,
  } = options;

  const handleError = useCallback((error: Error | unknown, customMessage?: string) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const displayMessage = customMessage || errorMessage || defaultMessage;

    // Log error for debugging
    console.error('Error handled:', error);

    // Call custom error handler if provided
    if (onError && error instanceof Error) {
      onError(error);
    }

    // Show alert if enabled
    if (showAlert) {
      Alert.alert(
        'Hata',
        displayMessage,
        [{ text: 'Tamam', style: 'default' }],
        { cancelable: true }
      );
    }

    // In production, you might want to send to error reporting service
    // Example: Sentry.captureException(error);
    
    return displayMessage;
  }, [showAlert, defaultMessage, onError]);

  return { handleError };
};

// Specific error handlers for common scenarios
export const useNetworkErrorHandler = () => {
  return useErrorHandler({
    defaultMessage: 'Bağlantı sorunu yaşandı. İnternet bağlantınızı kontrol edin.',
  });
};

export const useDataFetchErrorHandler = () => {
  return useErrorHandler({
    defaultMessage: 'Veriler yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.',
  });
};
