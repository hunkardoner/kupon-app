import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Switch,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../api/index';
import { styles } from './style';

const { width } = Dimensions.get('window');

interface UserStats {
  favoriteCount: number;
  savedAmount: number;
  usedCoupons: number;
  reviewCount: number;
}

interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  promotionsEnabled: boolean;
  remindersEnabled: boolean;
}

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    favoriteCount: 0,
    savedAmount: 0,
    usedCoupons: 0,
    reviewCount: 0,
  });
  const [notifications, setNotifications] = useState<NotificationSettings>({
    pushEnabled: true,
    emailEnabled: true,
    promotionsEnabled: true,
    remindersEnabled: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Kullanıcı istatistiklerini çek
      if (user?.id) {
        const [favoritesResponse, savingsResponse] = await Promise.allSettled([
          userAPI.getFavorites(),
          userAPI.getSavings(user.id),
        ]);

        const favoriteCount = favoritesResponse.status === 'fulfilled' 
          ? (favoritesResponse.value.coupons?.length || 0) + (favoritesResponse.value.brands?.length || 0)
          : 0;

        const savingsData = savingsResponse.status === 'fulfilled' 
          ? savingsResponse.value 
          : null;

        setStats({
          favoriteCount,
          savedAmount: savingsData?.total_saved || 0,
          usedCoupons: savingsData?.coupons_used || 0,
          reviewCount: 0, // TODO: Implement reviews
        });
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value,
    }));
    // TODO: API call to update preferences
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.profileImageContainer}>
        <View style={styles.profileImage}>
          <Ionicons name="person" size={40} color="#666" />
        </View>
      </View>
      
      <Text style={styles.userName}>{user?.name || 'Kullanıcı'}</Text>
      <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.favoriteCount}</Text>
          <Text style={styles.statLabel}>Favori</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.usedCoupons}</Text>
          <Text style={styles.statLabel}>Kullanılan</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₺{stats.savedAmount}</Text>
          <Text style={styles.statLabel}>Tasarruf</Text>
        </View>
      </View>
    </View>
  );

  const renderMenuItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightIcon?: string,
    isDestructive?: boolean
  ) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, isDestructive && styles.destructiveIcon]}>
        <Ionicons 
          name={icon as any} 
          size={20} 
          color={isDestructive ? '#f44336' : '#2196F3'} 
        />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, isDestructive && styles.destructiveText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        )}
      </View>
      {rightIcon && (
        <Ionicons name={rightIcon as any} size={20} color="#999" />
      )}
    </TouchableOpacity>
  );

  const renderSwitchMenuItem = (
    icon: string,
    title: string,
    subtitle: string,
    value: boolean,
    onValueChange: (value: boolean) => void
  ) => (
    <View style={styles.menuItem}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon as any} size={20} color="#2196F3" />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#e0e0e0', true: '#2196F3' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="person-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Giriş Yapın</Text>
          <Text style={styles.emptySubtitle}>
            Profil özelliklerini kullanmak için giriş yapmalısınız
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hesap</Text>
          {renderMenuItem(
            'person-outline',
            'Kişisel Bilgiler',
            'Profil bilgilerinizi düzenleyin',
            () => navigation.navigate('EditProfile'),
            'chevron-forward'
          )}
          {renderMenuItem(
            'heart-outline',
            'Favorilerim',
            `${stats.favoriteCount} favori kuponunuz var`,
            () => navigation.navigate('Favorites'),
            'chevron-forward'
          )}
          {renderMenuItem(
            'time-outline',
            'Kupon Geçmişi',
            'Kullandığınız kuponları görün',
            () => {/* TODO: Navigate to history */},
            'chevron-forward'
          )}
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirimler</Text>
          {renderSwitchMenuItem(
            'notifications-outline',
            'Push Bildirimleri',
            'Yeni kuponlar için bildirim alın',
            notifications.pushEnabled,
            (value) => handleNotificationChange('pushEnabled', value)
          )}
          {renderSwitchMenuItem(
            'mail-outline',
            'E-posta Bildirimleri',
            'E-posta ile kupon haberleri alın',
            notifications.emailEnabled,
            (value) => handleNotificationChange('emailEnabled', value)
          )}
          {renderSwitchMenuItem(
            'megaphone-outline',
            'Promosyon Bildirimleri',
            'Özel kampanya bildirimlerini alın',
            notifications.promotionsEnabled,
            (value) => handleNotificationChange('promotionsEnabled', value)
          )}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destek</Text>
          {renderMenuItem(
            'help-circle-outline',
            'Yardım Merkezi',
            'Sık sorulan sorular ve destek',
            () => {/* TODO: Navigate to help */},
            'chevron-forward'
          )}
          {renderMenuItem(
            'chatbubble-outline',
            'İletişim',
            'Bizimle iletişime geçin',
            () => {/* TODO: Navigate to contact */},
            'chevron-forward'
          )}
          {renderMenuItem(
            'document-text-outline',
            'Gizlilik Politikası',
            'Gizlilik ve kullanım koşulları',
            () => {/* TODO: Navigate to privacy */},
            'chevron-forward'
          )}
        </View>

        {/* Logout Section */}
        <View style={styles.section}>
          {renderMenuItem(
            'log-out-outline',
            'Çıkış Yap',
            undefined,
            handleLogout,
            undefined,
            true
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
