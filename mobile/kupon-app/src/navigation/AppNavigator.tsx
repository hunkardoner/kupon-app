import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; // İkon kütüphanesi
import { RootStackParamList, MainTabParamList, HomeStackParamList, CouponStackParamList, BrandStackParamList } from './types';

import HomeScreen from '../screens/HomeScreen';
import CouponListScreen from '../screens/CouponListScreen'; // Yeni liste ekranı
import BrandListScreen from '../screens/BrandListScreen';   // Yeni liste ekranı
import CouponScreen from '../screens/CouponScreen'; // Kupon detay ekranı
import BrandScreen from '../screens/BrandScreen';   // Marka detay ekranı

import { SafeAreaProvider } from 'react-native-safe-area-context';
import COLORS from '../constants/colors'; // Renk sabitleri

// Stack Navigator'lar
const HomeStack = createStackNavigator<HomeStackParamList>();
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Anasayfa' }} />
      {/* HomeScreen içinden navigasyonla açılacak diğer ekranlar buraya eklenebilir */}
    </HomeStack.Navigator>
  );
}

const CouponStack = createStackNavigator<CouponStackParamList>();
function CouponStackNavigator() {
  return (
    <CouponStack.Navigator>
      <CouponStack.Screen name="CouponList" component={CouponListScreen} options={{ title: 'Kuponlar' }} />
      <CouponStack.Screen name="CouponDetail" component={CouponScreen} options={{ title: 'Kupon Detayı' }} />
    </CouponStack.Navigator>
  );
}

const BrandStack = createStackNavigator<BrandStackParamList>();
function BrandStackNavigator() {
  return (
    <BrandStack.Navigator>
      <BrandStack.Screen name="BrandList" component={BrandListScreen} options={{ title: 'Markalar' }} />
      <BrandStack.Screen name="BrandDetail" component={BrandScreen} options={{ title: 'Marka Detayı' }} />
    </BrandStack.Navigator>
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

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CouponsTab') {
            iconName = focused ? 'pricetag' : 'pricetag-outline';
          } else if (route.name === 'BrandsTab') {
            iconName = focused ? 'business' : 'business-outline';
          }
          // @ts-ignore // Ionicons type issue with string name
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        headerShown: false, // Her tab'ın kendi stack header'ı olacak
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Anasayfa' }} />
      <Tab.Screen name="CouponsTab" component={CouponStackNavigator} options={{ title: 'Kuponlar' }} />
      <Tab.Screen name="BrandsTab" component={BrandStackNavigator} options={{ title: 'Markalar' }} />
    </Tab.Navigator>
  );
}

// Ana App Navigator (Root Stack)
const RootStack = createStackNavigator<RootStackParamList>();

function AppNavigator(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="MainTabs" component={MainTabNavigator} />
          {/* Global modal ekranlar veya tab dışı stack ekranları buraya eklenebilir */}
          {/* Artık Coupon ve Brand global stack'te değil, kendi tab stack'lerinde yönetiliyor.
          <RootStack.Screen name="Coupon" component={CouponScreen} /> 
          <RootStack.Screen name="Brand" component={BrandScreen} /> 
          */}
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default AppNavigator;
