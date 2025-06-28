import React, { useState } from 'react';
import { ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../../navigation/types';

type NotificationsScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Notifications'>;

interface NotificationsScreenProps {
  navigation: NotificationsScreenNavigationProp;
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }: any) => theme.spacing.large}px;
  background-color: ${({ theme }: any) => theme.colors.surface};
`;

const HeaderTitle = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.xl}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  color: ${({ theme }: any) => theme.colors.text};
  margin-left: ${({ theme }: any) => theme.spacing.medium}px;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: ${({ theme }: any) => theme.spacing.large}px;
`;

const Section = styled.View`
  margin-bottom: ${({ theme }: any) => theme.spacing.large}px;
`;

const SectionTitle = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.large}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  color: ${({ theme }: any) => theme.colors.text};
  margin-bottom: ${({ theme }: any) => theme.spacing.medium}px;
`;

const NotificationItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }: any) => theme.spacing.medium}px;
  background-color: ${({ theme }: any) => theme.colors.surface};
  border-radius: ${({ theme }: any) => theme.borderRadius.medium}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.small}px;
`;

const NotificationContent = styled.View`
  flex: 1;
`;

const NotificationTitle = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.medium};
  color: ${({ theme }: any) => theme.colors.text};
  margin-bottom: 2px;
`;

const NotificationDescription = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.small}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
`;

export function NotificationsScreen({ navigation }: NotificationsScreenProps) {
  const { theme } = useTheme();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [couponAlerts, setCouponAlerts] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);

  return (
    <Container>
      <Header>
        <Ionicons 
          name="chevron-back" 
          size={24} 
          color={theme.colors.text} 
          onPress={() => navigation.goBack()}
        />
        <HeaderTitle>Bildirimler</HeaderTitle>
      </Header>

      <Content>
        <Section>
          <SectionTitle>Genel Bildirimler</SectionTitle>
          
          <NotificationItem>
            <NotificationContent>
              <NotificationTitle>Push Bildirimleri</NotificationTitle>
              <NotificationDescription>Uygulama bildirimleri alın</NotificationDescription>
            </NotificationContent>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '30' }}
              thumbColor={pushNotifications ? theme.colors.primary : theme.colors.textSecondary}
            />
          </NotificationItem>

          <NotificationItem>
            <NotificationContent>
              <NotificationTitle>Email Bildirimleri</NotificationTitle>
              <NotificationDescription>Önemli güncellemeler için email alın</NotificationDescription>
            </NotificationContent>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '30' }}
              thumbColor={emailNotifications ? theme.colors.primary : theme.colors.textSecondary}
            />
          </NotificationItem>
        </Section>

        <Section>
          <SectionTitle>Kupon Bildirimleri</SectionTitle>
          
          <NotificationItem>
            <NotificationContent>
              <NotificationTitle>Yeni Kupon Uyarıları</NotificationTitle>
              <NotificationDescription>Yeni kuponlar yayınlandığında bilgi alın</NotificationDescription>
            </NotificationContent>
            <Switch
              value={couponAlerts}
              onValueChange={setCouponAlerts}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '30' }}
              thumbColor={couponAlerts ? theme.colors.primary : theme.colors.textSecondary}
            />
          </NotificationItem>

          <NotificationItem>
            <NotificationContent>
              <NotificationTitle>Pazarlama Bildirimleri</NotificationTitle>
              <NotificationDescription>Özel teklifler ve kampanyalar hakkında bilgi alın</NotificationDescription>
            </NotificationContent>
            <Switch
              value={marketingNotifications}
              onValueChange={setMarketingNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '30' }}
              thumbColor={marketingNotifications ? theme.colors.primary : theme.colors.textSecondary}
            />
          </NotificationItem>
        </Section>
      </Content>
    </Container>
  );
}

export default NotificationsScreen;
