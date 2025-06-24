import React, { useEffect, useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import { Platform, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Context Providers
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { FavoritesProvider } from './src/context/FavoritesContext';

// Screens
import { Dashboard } from './src/components/screens/Dashboard';
import { AuthScreen } from './src/components/screens/AuthScreen';
import ProfileScreen from './src/screens/profile'; // Updated to new folder structure
import CouponListScreen from './src/screens/coupons/coupon-list'; // Updated to new folder structure
import CouponScreen from './src/screens/coupons/coupon-detail'; // Updated to new folder structure
import BrandListScreen from './src/screens/brands/brand-list'; // Updated to new folder structure
import BrandScreen from './src/screens/brands/brand-detail'; // Updated to new folder structure
import CategoryListScreen from './src/screens/categories/category-list'; // Updated to new folder structure
import CategoryScreen from './src/screens/categories/category-detail'; // Updated to new folder structure

// Services
import { notificationService } from './src/services/notificationService';

// Create a client with optimized configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});

// Navigation Types
type MainTabParamList = {
  Dashboard: undefined;
  Coupons: undefined;
  Brands: undefined;
  Categories: undefined;
  Profile: undefined;
};

type RootStackParamList = {
  MainTabs: undefined;
  Auth: undefined;
  CouponDetail: { couponId: number };
  BrandDetail: { brandId: number };
  CategoryDetail: { categoryId: number };
};

// Create navigators
const MainTab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

// Simple wrapper components for tab screens that need navigation
function CouponsTab({ navigation }: any) {
  return <CouponListScreen navigation={navigation} />;
}

function BrandsTab({ navigation, route }: any) {
  return <BrandListScreen navigation={navigation} route={{ ...route, name: 'BrandList' }} />;
}

function CategoriesTab({ navigation, route }: any) {
  return <CategoryListScreen navigation={navigation} route={{ ...route, name: 'CategoryList' }} />;
}

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Coupons') {
            iconName = focused ? 'ticket' : 'ticket-outline';
          } else if (route.name === 'Brands') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <MainTab.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{ 
          title: 'Ana Sayfa',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <MainTab.Screen 
        name="Coupons" 
        component={CouponsTab}
        options={{ title: 'Kuponlar' }}
      />
      <MainTab.Screen 
        name="Brands" 
        component={BrandsTab}
        options={{ title: 'Markalar' }}
      />
      <MainTab.Screen 
        name="Categories" 
        component={CategoriesTab}
        options={{ title: 'Kategoriler' }}
      />
      <MainTab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profil' }}
      />
    </MainTab.Navigator>
  );
}

// Loading Component
function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

// Main App Navigator
function AppNavigator() {
  const authContext = useContext(AuthContext);
  const [isGuestMode, setIsGuestMode] = useState(false);
  
  if (!authContext) {
    throw new Error('AppNavigator must be used within AuthProvider');
  }

  const { user, isLoading, isAuthenticated } = authContext;

  console.log('App Navigator - user:', user);
  console.log('App Navigator - isAuthenticated:', isAuthenticated);
  console.log('App Navigator - isLoading:', isLoading);
  console.log('App Navigator - isGuestMode:', isGuestMode);

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

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user && isAuthenticated || isGuestMode ? (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
            <RootStack.Screen 
              name="CouponDetail" 
              options={{ 
                headerShown: true,
                title: 'Kupon Detayı',
                presentation: 'modal'
              }}
            >
              {({ route, navigation }) => (
                <CouponScreen 
                  route={{ ...route, name: 'CouponDetail' }} 
                  navigation={navigation} 
                />
              )}
            </RootStack.Screen>
            <RootStack.Screen 
              name="BrandDetail" 
              options={{ 
                headerShown: true,
                title: 'Marka Detayı',
                presentation: 'modal'
              }}
            >
              {({ route, navigation }) => (
                <BrandScreen 
                  route={{ ...route, name: 'BrandDetail' }} 
                  navigation={navigation} 
                />
              )}
            </RootStack.Screen>
            <RootStack.Screen 
              name="CategoryDetail" 
              component={CategoryScreen}
              options={{ 
                headerShown: true,
                title: 'Kategori Detayı',
                presentation: 'modal'
              }}
            />
          </>
        ) : (
          <RootStack.Screen name="Auth">
            {(props) => <AuthScreen {...props} onGuestContinue={() => setIsGuestMode(true)} />}
          </RootStack.Screen>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
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
                <AppNavigator />
              </FavoritesProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
