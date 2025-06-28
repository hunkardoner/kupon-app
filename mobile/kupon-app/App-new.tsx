import React, { useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import { View, ActivityIndicator } from 'react-native';

// Navigation
import AppNavigator from './src/navigation/AppNavigator';

// Context Providers
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { FavoritesProvider } from './src/context/FavoritesContext';

// Screens
import { AuthScreen } from './src/screens/auth';

// Services
import { notificationService } from './src/services/notificationService';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

// Main App Navigator
function AuthenticatedApp() {
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error('AuthenticatedApp must be used within AuthProvider');
  }

  const { user, isLoading, isAuthenticated } = authContext;

  useEffect(() => {
    // Initialize notification service when app starts
    const initNotifications = async () => {
      try {
        await notificationService.requestPermissions();
      } catch (error) {
        console.warn('Notification permissions not granted:', error);
      }
    };
    
    initNotifications();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user || !isAuthenticated) {
    return <AuthScreen />;
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <FavoritesProvider>
                <StatusBar style="auto" />
                <AuthenticatedApp />
              </FavoritesProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
