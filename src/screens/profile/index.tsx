import React from 'react';
import { ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../navigation/types';

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'ProfileHome'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

// Styled Components
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.background};
`;

const Header = styled.View`
  padding: ${({ theme }: any) => theme.spacing.large}px;
  background-color: ${({ theme }: any) => theme.colors.primary};
  align-items: center;
`;

const ProfileImage = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${({ theme }: any) => theme.colors.background};
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }: any) => theme.spacing.medium}px;
`;

const UserName = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.xl}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  color: white;
  margin-bottom: ${({ theme }: any) => theme.spacing.small}px;
`;

const UserEmail = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  color: rgba(255, 255, 255, 0.8);
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

const MenuItem = styled.TouchableOpacity<{ isDestructive?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }: any) => theme.spacing.medium}px;
  background-color: ${({ theme }: any) => theme.colors.surface};
  border-radius: ${({ theme }: any) => theme.borderRadius.medium}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.small}px;
`;

const MenuItemIcon = styled.View<{ isDestructive?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ theme, isDestructive }: any) => 
    isDestructive ? theme.colors.error : theme.colors.primary}15;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }: any) => theme.spacing.medium}px;
`;

const MenuItemText = styled.Text<{ isDestructive?: boolean }>`
  flex: 1;
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  color: ${({ theme, isDestructive }: any) => 
    isDestructive ? theme.colors.error : theme.colors.text};
  font-weight: ${({ theme }: any) => theme.typography.weights.medium};
`;

const MenuItemSubtitle = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.small}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
  margin-top: 2px;
`;

const StatsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  background-color: ${({ theme }: any) => theme.colors.surface};
  border-radius: ${({ theme }: any) => theme.borderRadius.medium}px;
  padding: ${({ theme }: any) => theme.spacing.large}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.large}px;
`;

const StatItem = styled.View`
  align-items: center;
`;

const StatValue = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.xl}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  color: ${({ theme }: any) => theme.colors.primary};
  margin-bottom: ${({ theme }: any) => theme.spacing.small}px;
`;

const StatLabel = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.small}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
  text-align: center;
`;

export function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

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

  const handleNavigate = (screen: keyof ProfileStackParamList) => {
    navigation.navigate(screen);
  };

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Header>
        <ProfileImage>
          <Ionicons 
            name="person" 
            size={40} 
            color={theme.colors.primary} 
          />
        </ProfileImage>
        <UserName>{user.name}</UserName>
        <UserEmail>{user.email}</UserEmail>
      </Header>

      <Content>
        {/* Stats Section */}
        <StatsContainer>
          <StatItem>
            <StatValue>₺{user.totalSavings?.toFixed(2) || '0.00'}</StatValue>
            <StatLabel>Toplam{'\n'}Tasarruf</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{user.favoriteCategories?.length || 0}</StatValue>
            <StatLabel>Favori{'\n'}Kategori</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>
              {user.memberSince ? 
                Math.floor((Date.now() - new Date(user.memberSince).getTime()) / (1000 * 60 * 60 * 24)) 
                : 0}
            </StatValue>
            <StatLabel>Üyelik{'\n'}Günü</StatLabel>
          </StatItem>
        </StatsContainer>

        {/* Settings Section */}
        <Section>
          <SectionTitle>Ayarlar</SectionTitle>
          
          <MenuItem onPress={() => handleNavigate('Notifications')}>
            <MenuItemIcon>
              <Ionicons name="notifications-outline" size={16} color={theme.colors.primary} />
            </MenuItemIcon>
            <MenuItemText>Bildirimler</MenuItemText>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
          </MenuItem>

          <MenuItem onPress={() => handleNavigate('Preferences')}>
            <MenuItemIcon>
              <Ionicons name="heart-outline" size={16} color={theme.colors.primary} />
            </MenuItemIcon>
            <MenuItemText>Tercihlerim</MenuItemText>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
          </MenuItem>

          <MenuItem onPress={() => handleNavigate('Language')}>
            <MenuItemIcon>
              <Ionicons name="language-outline" size={16} color={theme.colors.primary} />
            </MenuItemIcon>
            <MenuItemText>Dil</MenuItemText>
            <MenuItemSubtitle>Türkçe</MenuItemSubtitle>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
          </MenuItem>

          <MenuItem onPress={() => handleNavigate('Currency')}>
            <MenuItemIcon>
              <Ionicons name="card-outline" size={16} color={theme.colors.primary} />
            </MenuItemIcon>
            <MenuItemText>Para Birimi</MenuItemText>
            <MenuItemSubtitle>₺ TRY</MenuItemSubtitle>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
          </MenuItem>
        </Section>

        {/* Support Section */}
        <Section>
          <SectionTitle>Destek</SectionTitle>
          
          <MenuItem onPress={() => handleNavigate('HelpCenter')}>
            <MenuItemIcon>
              <Ionicons name="help-circle-outline" size={16} color={theme.colors.primary} />
            </MenuItemIcon>
            <MenuItemText>Yardım</MenuItemText>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
          </MenuItem>

          <MenuItem onPress={() => handleNavigate('TermsOfService')}>
            <MenuItemIcon>
              <Ionicons name="document-text-outline" size={16} color={theme.colors.primary} />
            </MenuItemIcon>
            <MenuItemText>Kullanım Koşulları</MenuItemText>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
          </MenuItem>

          <MenuItem onPress={() => handleNavigate('PrivacyPolicy')}>
            <MenuItemIcon>
              <Ionicons name="shield-outline" size={16} color={theme.colors.primary} />
            </MenuItemIcon>
            <MenuItemText>Gizlilik Politikası</MenuItemText>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
          </MenuItem>

          <MenuItem>
            <MenuItemIcon>
              <Ionicons name="information-circle-outline" size={16} color={theme.colors.primary} />
            </MenuItemIcon>
            <MenuItemText>Hakkında</MenuItemText>
            <MenuItemSubtitle>Sürüm 1.0.0</MenuItemSubtitle>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
          </MenuItem>
        </Section>

        {/* Logout Section */}
        <Section>
          <MenuItem onPress={handleLogout} isDestructive>
            <MenuItemIcon isDestructive>
              <Ionicons name="log-out-outline" size={16} color={theme.colors.error} />
            </MenuItemIcon>
            <MenuItemText isDestructive>Çıkış Yap</MenuItemText>
          </MenuItem>
        </Section>
      </Content>
    </Container>
  );
}

export default ProfileScreen;
