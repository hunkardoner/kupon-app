import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Image,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/index';

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

const ProfileScreen: React.FC = () => {
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
          ? favoritesResponse.value.length 
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
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="camera" size={16} color="#fff" />
        </TouchableOpacity>
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
            () => {/* TODO: Navigate to edit profile */},
            'chevron-forward'
          )}
          {renderMenuItem(
            'heart-outline',
            'Favorilerim',
            `${stats.favoriteCount} favori kuponunuz var`,
            () => {/* TODO: Navigate to favorites */},
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#e0e0e0',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2196F3',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  destructiveIcon: {
    backgroundColor: '#ffebee',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  destructiveText: {
    color: '#f44336',
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default ProfileScreen;
