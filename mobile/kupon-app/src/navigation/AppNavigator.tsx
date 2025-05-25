import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; // İkon kütüphanesi
import {
  RootStackParamList,
  MainTabParamList,
  HomeStackParamList,
  CouponStackParamList,
  BrandStackParamList,
  CategoryStackParamList,
} from './types';

import HomeScreen from '../screens/HomeScreen';
import CouponListScreen from '../screens/CouponListScreen'; // Kupon liste ekranı
import BrandListScreen from '../screens/BrandListScreen'; // Marka liste ekranı
import CouponScreen from '../screens/CouponScreen'; // Kupon detay ekranı
import BrandScreen from '../screens/BrandScreen'; // Marka detay ekranı
import CategoryListScreen from '../screens/CategoryListScreen'; // Kategori liste ekranı
import CategoryScreen from '../screens/CategoryScreen'; // Kategori detay ekranı

import { SafeAreaProvider } from 'react-native-safe-area-context';
import COLORS from '../constants/colors'; // Renk sabitleri

// Stack Navigator'lar
const HomeStack = createStackNavigator<HomeStackParamList>();
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Anasayfa' }}
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

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CouponsTab') {
            iconName = focused ? 'pricetag' : 'pricetag-outline';
          } else if (route.name === 'BrandsTab') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'CategoriesTab') {
            iconName = focused ? 'grid' : 'grid-outline';
          }
          // @ts-ignore // Ionicons type issue with string name
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        headerShown: false, // Her tab'ın kendi stack header'ı olacak
      })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ title: 'Anasayfa' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Home tab'ına basıldığında Home stack'ini root'a resetle
            navigation.navigate('HomeTab', { screen: 'Home' });
          },
        })}
      />
      <Tab.Screen
        name="CouponsTab"
        component={CouponStackNavigator}
        options={{ title: 'Kuponlar' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Coupon tab'ına basıldığında Coupon stack'ini root'a resetle
            navigation.navigate('CouponsTab', { screen: 'CouponList' });
          },
        })}
      />
      <Tab.Screen
        name="BrandsTab"
        component={BrandStackNavigator}
        options={{ title: 'Markalar' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Brand tab'ına basıldığında Brand stack'ini root'a resetle
            navigation.navigate('BrandsTab', { screen: 'BrandList' });
          },
        })}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoryStackNavigator}
        options={{ title: 'Kategoriler' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Category tab'ına basıldığında Category stack'ini root'a resetle
            navigation.navigate('CategoriesTab', { screen: 'CategoryList' });
          },
        })}
      />
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
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default AppNavigator;
