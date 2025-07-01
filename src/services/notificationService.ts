import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NOTIFICATION_TYPES, STORAGE_KEYS } from '../constants/config';

// Conditionally import expo-notifications and expo-device only on mobile platforms
let Notifications: any = null;
let Device: any = null;

if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');
  Device = require('expo-device');

  // Configure notifications behavior only on mobile platforms
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

interface NotificationSettings {
  enabled: boolean;
  newCoupons: boolean;
  priceDrops: boolean;
  expiryAlerts: boolean;
  personalized: boolean;
}

class NotificationService {
  private expoPushToken: string | null = null;

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      console.log('Push notifications not supported on web');
      return false;
    }

    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  }

  async registerForPushNotifications(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      this.expoPushToken = token;

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      // Store token locally
      await AsyncStorage.setItem('pushToken', token);
      
      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any,
    trigger?: any
  ) {
    if (Platform.OS === 'web') {
      console.log('Local notifications not supported on web');
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: trigger || null,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }

  async scheduleNewCouponAlert(couponTitle: string, brandName: string, category: string) {
    const settings = await this.getNotificationSettings();
    if (!settings.enabled || !settings.newCoupons) return;

    await this.scheduleLocalNotification(
      '🎉 Yeni Kupon!',
      `${brandName} için yeni kupon: ${couponTitle}`,
      {
        type: NOTIFICATION_TYPES.NEW_COUPON,
        category,
        brand: brandName,
      }
    );
  }

  async schedulePriceDropAlert(productName: string, oldPrice: number, newPrice: number) {
    const settings = await this.getNotificationSettings();
    if (!settings.enabled || !settings.priceDrops) return;

    await this.scheduleLocalNotification(
      '💰 Fiyat Düştü!',
      `${productName} ürünü ${oldPrice}₺'den ${newPrice}₺'ye düştü!`,
      {
        type: NOTIFICATION_TYPES.PRICE_DROP,
        product: productName,
        oldPrice,
        newPrice,
      }
    );
  }

  async scheduleExpiryAlert(couponTitle: string, expiryDate: Date) {
    const settings = await this.getNotificationSettings();
    if (!settings.enabled || !settings.expiryAlerts) return;

    // Schedule 24 hours before expiry
    const triggerDate = new Date(expiryDate.getTime() - 24 * 60 * 60 * 1000);
    
    if (triggerDate > new Date()) {
      await this.scheduleLocalNotification(
        '⏰ Kupon Süresi Bitiyor!',
        `${couponTitle} kuponu yarın sona erecek!`,
        {
          type: NOTIFICATION_TYPES.COUPON_EXPIRY,
          couponTitle,
        },
        null // Immediate notification
      );
    }
  }

  async schedulePersonalizedAlert(message: string, data?: any) {
    const settings = await this.getNotificationSettings();
    if (!settings.enabled || !settings.personalized) return;

    await this.scheduleLocalNotification(
      '✨ Sizin İçin Özel',
      message,
      {
        type: NOTIFICATION_TYPES.PERSONALIZED,
        ...data,
      }
    );
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (settings) {
        const parsed = JSON.parse(settings);
        return parsed.notifications || this.getDefaultSettings();
      }
    } catch (error) {
      console.error('Error getting notification settings:', error);
    }
    return this.getDefaultSettings();
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>) {
    try {
      const currentSettings = await this.getNotificationSettings();
      const newSettings = { ...currentSettings, ...settings };
      
      const preferences = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      const currentPrefs = preferences ? JSON.parse(preferences) : {};
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.PREFERENCES,
        JSON.stringify({
          ...currentPrefs,
          notifications: newSettings,
        })
      );
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  }

  private getDefaultSettings(): NotificationSettings {
    return {
      enabled: true,
      newCoupons: true,
      priceDrops: true,
      expiryAlerts: true,
      personalized: true,
    };
  }

  async cancelAllNotifications() {
    if (Platform.OS === 'web') {
      console.log('Notifications not supported on web');
      return;
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async cancelNotificationsByType(type: string) {
    if (Platform.OS === 'web') {
      console.log('Notifications not supported on web');
      return;
    }

    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    const toCancel = notifications
      .filter((notification: any) => notification.content.data?.type === type)
      .map((notification: any) => notification.identifier);
    
    if (toCancel.length > 0) {
      // Cancel notifications one by one
      for (const id of toCancel) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
    }
  }

  getPushToken(): string | null {
    return this.expoPushToken;
  }
}

export const notificationService = new NotificationService();
