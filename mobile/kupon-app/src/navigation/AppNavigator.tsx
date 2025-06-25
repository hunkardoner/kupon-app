import React, { useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // İkon kütüphanesi
import {
  RootStackParamList,
  MainTabParamList,
  HomeStackParamList,
  CouponStackParamList,
  BrandStackParamList,
  CategoryStackParamList,
} from './types';

import HomeScreen from '../screens/home'; // Updated to new folder structure
import { Dashboard } from '../components/screens/Dashboard';
import CouponListScreen from '../screens/coupons/coupon-list'; // Yeni klasör yapısı
import BrandListScreen from '../screens/brands/brand-list'; // Yeni klasör yapısı
import CouponScreen from '../screens/coupons/coupon-detail'; // Yeni klasör yapısı
import BrandScreen from '../screens/brands/brand-detail'; // Yeni klasör yapısı
import CategoryListScreen from '../screens/categories/category-list'; // Yeni klasör yapısı
import CategoryScreen from '../screens/categories/category-detail'; // Yeni klasör yapısı

// Support screens
import PrivacyPolicyScreen from '../screens/support/privacy-policy';
import ContactScreen from '../screens/support/contact';
import HelpCenterScreen from '../screens/support/help-center';

// Profile screens
import ProfileScreen from '../screens/profile';
import EditProfileScreen from '../screens/profile/edit-profile';
import FavoritesScreen from '../screens/profile/favorites';

// Search screen
import SearchScreen from '../screens/search';

// Auth screen
import { AuthScreen } from '../components/screens/AuthScreen';

// Context
import { AuthContext } from '../context/AuthContext';

import COLORS from '../constants/colors'; // Renk sabitleri

// Stack Navigator'lar
const HomeStack = createStackNavigator<HomeStackParamList>();
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Dashboard}
        options={{ title: 'Anasayfa' }}
      />
      <HomeStack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ title: 'Dashboard' }}
      />
      {/* Detail screens are typically part of their respective stacks or a common modal stack */}
      {/* For navigating from Home to details in other tabs, the navigation action will target the tab first */}
      <HomeStack.Screen
        name="CouponDetail"
        component={CouponScreen}
        options={{ title: 'Kupon Detayı' }}
      />
      <HomeStack.Screen
        name="BrandDetail"
        component={BrandScreen}
        options={{ title: 'Marka Detayı' }}
      />
      <HomeStack.Screen
        name="CategoryDetail"
        component={CategoryScreen}
        options={{ title: 'Kategori Detayı' }}
      />
    </HomeStack.Navigator>
  );
}

const CouponStack = createStackNavigator<CouponStackParamList>();
function CouponStackNavigator() {
  return (
    <CouponStack.Navigator>
      <CouponStack.Screen
        name="CouponList"
        component={CouponListScreen}
        options={{ title: 'Kuponlar' }}
      />
      <CouponStack.Screen
        name="CouponDetail"
        component={CouponScreen}
        options={{ title: 'Kupon Detayı' }}
      />
    </CouponStack.Navigator>
  );
}

const BrandStack = createStackNavigator<BrandStackParamList>();
function BrandStackNavigator() {
  return (
    <BrandStack.Navigator>
      <BrandStack.Screen
        name="BrandList"
        component={BrandListScreen}
        options={{ title: 'Markalar' }}
      />
      <BrandStack.Screen
        name="BrandDetail"
        component={BrandScreen}
        options={{ title: 'Marka Detayı' }}
      />
    </BrandStack.Navigator>
  );
}

// Yeni eklenen Kategoriler stack'i
const CategoryStack = createStackNavigator<CategoryStackParamList>();
function CategoryStackNavigator() {
  return (
    <CategoryStack.Navigator>
      <CategoryStack.Screen
        name="CategoryList"
        component={CategoryListScreen}
        options={{ title: 'Kategoriler' }}
      />
      <CategoryStack.Screen
        name="CategoryDetail"
        component={CategoryScreen}
        options={{ title: 'Kategori Detayı' }}
      />
    </CategoryStack.Navigator>
  );
}

// Bottom Tab Navigator
const Tab = createBottomTabNavigator<MainTabParamList>();
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Coupons') {
            iconName = focused ? 'pricetag' : 'pricetag-outline';
          } else if (route.name === 'Brands') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          // @ts-ignore // Ionicons type issue with string name
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        headerShown: false, // Her tab'ın kendi stack header'ı olacak
      })}>
      <Tab.Screen
        name="Dashboard"
        component={HomeStackNavigator}
        options={{ title: 'Anasayfa' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Home tab'ına basıldığında Home stack'ini root'a resetle
            navigation.reset({
              index: 0,
              routes: [{ name: 'Dashboard' }],
            });
          },
        })}
      />
      <Tab.Screen
        name="Coupons"
        component={CouponStackNavigator}
        options={{ title: 'Kuponlar' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Coupon tab'ına basıldığında Coupon stack'ini root'a resetle
            navigation.reset({
              index: 0,
              routes: [{ name: 'Coupons' }],
            });
          },
        })}
      />
      <Tab.Screen
        name="Brands"
        component={BrandStackNavigator}
        options={{ title: 'Markalar' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Brand tab'ına basıldığında Brand stack'ini root'a resetle
            navigation.reset({
              index: 0,
              routes: [{ name: 'Brands' }],
            });
          },
        })}
      />
      <Tab.Screen
        name="Categories"
        component={CategoryStackNavigator}
        options={{ title: 'Kategoriler' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Category tab'ına basıldığında Category stack'ini root'a resetle
            navigation.reset({
              index: 0,
              routes: [{ name: 'Categories' }],
            });
          },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

// Ana App Navigator (Root Stack)
const RootStack = createStackNavigator<RootStackParamList>();

function AppNavigator(): React.JSX.Element {
  const authContext = useContext(AuthContext);
  const [isGuestMode, setIsGuestMode] = useState(false);
  
  if (!authContext) {
    throw new Error('AppNavigator must be used within AuthProvider');
  }

  const { user, isLoading, isAuthenticated } = authContext;

  if (isLoading) {
    return (
      <NavigationContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {(user && isAuthenticated) || isGuestMode ? (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
            
            {/* Profile Screens */}
            <RootStack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen 
              name="Favorites" 
              component={FavoritesScreen}
              options={{ headerShown: false }}
            />
            
            {/* Search Screen */}
            <RootStack.Screen 
              name="Search" 
              component={SearchScreen}
              options={{ headerShown: false }}
            />
            
            {/* Detail Screens as Modals */}
            <RootStack.Screen 
              name="CouponDetail" 
              component={CouponScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen 
              name="BrandDetail" 
              component={BrandScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen 
              name="CategoryDetail" 
              component={CategoryScreen}
              options={{ headerShown: false }}
            />
            
            {/* Support Screens */}
            <RootStack.Screen 
              name="PrivacyPolicy" 
              component={PrivacyPolicyScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen 
              name="Contact" 
              component={ContactScreen}
              options={{ headerShown: false }}
            />
            <RootStack.Screen 
              name="HelpCenter" 
              component={HelpCenterScreen}
              options={{ headerShown: false }}
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

export default AppNavigator;
