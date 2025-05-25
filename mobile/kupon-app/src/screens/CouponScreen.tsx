import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Alert,
  Linking,
  Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, NavigatorScreenParams, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CouponStackParamList, CategoryStackParamList, MainTabParamList } from '../navigation/types';
import { Coupon } from '../types';
import { API_BASE_URL } from '../api/index';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';
import { useCoupon } from '../hooks/useQueries';

// Styled Components
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.background};
`;

const CenteredContainer = styled.SafeAreaView`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }: any) => theme.colors.background};
`;

const ContentContainer = styled.View`
  padding: ${({ theme }: any) => theme.spacing.lg}px;
  align-items: center;
`;

const BrandLogo = styled.Image`
  width: 150px;
  height: 75px;
  margin-bottom: ${({ theme }: any) => theme.spacing.md}px;
`;

const BrandName = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.xl}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  color: ${({ theme }: any) => theme.colors.primary};
  margin-bottom: ${({ theme }: any) => theme.spacing.md}px;
  text-align: center;
`;

const CampaignTitle = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.large}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.semiBold};
  color: ${({ theme }: any) => theme.colors.text};
  margin-bottom: ${({ theme }: any) => theme.spacing.sm}px;
  text-align: center;
`;

const CouponCodeLabel = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }: any) => theme.spacing.xs}px;
`;

const CouponCode = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.xl}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  color: ${({ theme }: any) => theme.colors.primary};
  padding-vertical: ${({ theme }: any) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }: any) => theme.spacing.lg}px;
  background-color: ${({ theme }: any) => theme.colors.surface};
  border: 2px solid ${({ theme }: any) => theme.colors.primary};
  border-radius: ${({ theme }: any) => theme.borders.radius.medium}px;
  text-align: center;
  min-width: 60%;
  margin-right: ${({ theme }: any) => theme.spacing.sm}px;
`;

const DetailsContainer = styled.View`
  width: 100%;
  margin-bottom: ${({ theme }: any) => theme.spacing.lg}px;
`;

const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding-vertical: ${({ theme }: any) => theme.spacing.sm}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: any) => theme.colors.border};
  margin-bottom: ${({ theme }: any) => theme.spacing.sm}px;
`;

const DetailLabel = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.semiBold};
  color: ${({ theme }: any) => theme.colors.text};
  flex: 0 0 auto;
  margin-right: ${({ theme }: any) => theme.spacing.md}px;
`;

const DetailValue = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
  flex: 1;
  text-align: right;
`;

const Description = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  color: ${({ theme }: any) => theme.colors.text};
  text-align: center;
  line-height: 22px;
  margin-top: ${({ theme }: any) => theme.spacing.md}px;
`;

const ErrorText = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.subtitle.fontSize}px;
  color: ${({ theme }: any) => theme.colors.error};
`;

const CategoriesContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  flex: 1;
`;

const CategoryTag = styled.TouchableOpacity`
  background-color: ${({ theme }: any) => theme.colors.primary};
  padding-horizontal: ${({ theme }: any) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }: any) => theme.spacing.xs}px;
  border-radius: ${({ theme }: any) => theme.borders.radius.small}px;
  margin-left: ${({ theme }: any) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.xs}px;
`;

const CategoryTagText = styled.Text`
  color: ${({ theme }: any) => theme.colors.surface};
  font-size: ${({ theme }: any) => theme.typography.sizes.small}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.medium};
`;

const RevealCodeButton = styled.TouchableOpacity`
  background-color: #667eea;
  padding: ${({ theme }: any) => theme.spacing.md}px ${({ theme }: any) => theme.spacing.lg}px;
  border-radius: ${({ theme }: any) => theme.borders.radius.medium}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.md}px;
  shadow-color: #764ba2;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 8;
  border: 2px solid #ffd700;
  align-items: center;
  justify-content: center;
  min-height: 60px;
`;

const RevealCodeButtonText = styled.Text`
  color: #ffffff;
  font-size: ${({ theme }: any) => theme.typography.sizes.large}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  text-shadow: 0px 1px 2px rgba(0,0,0,0.3);
`;

const RevealCodeHint = styled.Text`
  color: rgba(255, 255, 255, 0.8);
  font-size: ${({ theme }: any) => theme.typography.sizes.small}px;
  margin-top: 4px;
  text-align: center;
`;

const UTMButton = styled.TouchableOpacity`
  background-color: ${({ theme }: any) => theme.colors.success};
  padding: ${({ theme }: any) => theme.spacing.md}px ${({ theme }: any) => theme.spacing.lg}px;
  border-radius: ${({ theme }: any) => theme.borders.radius.medium}px;
  margin-top: ${({ theme }: any) => theme.spacing.md}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  shadow-color: ${({ theme }: any) => theme.colors.success};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 4;
`;

const UTMButtonText = styled.Text`
  color: ${({ theme }: any) => theme.colors.surface};
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  margin-left: ${({ theme }: any) => theme.spacing.sm}px;
`;

const CouponCodeContainer = styled.View`
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  margin-bottom: ${({ theme }: any) => theme.spacing.md}px;
  width: 100%;
`;

const ButtonGroup = styled.View`
  flex-direction: row;
  align-items: stretch;
`;

const CopyButton = styled.TouchableOpacity`
  background-color: ${({ theme }: any) => theme.colors.primary};
  padding: ${({ theme }: any) => theme.spacing.md}px;
  border-radius: ${({ theme }: any) => theme.borders.radius.medium}px;
  margin-left: ${({ theme }: any) => theme.spacing.sm}px;
  justify-content: center;
  align-items: center;
  min-height: 56px;
  min-width: 56px;
`;

const ShareButton = styled.TouchableOpacity`
  background-color: ${({ theme }: any) => theme.colors.secondary || theme.colors.primary};
  padding: ${({ theme }: any) => theme.spacing.md}px;
  border-radius: ${({ theme }: any) => theme.borders.radius.medium}px;
  margin-left: ${({ theme }: any) => theme.spacing.sm}px;
  justify-content: center;
  align-items: center;
  min-height: 56px;
  min-width: 56px;
`;

// const CopyButtonText = styled.Text`
//   color: ${({ theme }: any) => theme.colors.surface};
//   font-size: ${({ theme }: any) => theme.typography.sizes.large}px;
//   font-weight: ${({ theme }: any) => theme.typography.weights.medium};
// `;

const CampaignButton = styled.TouchableOpacity`
  background-color: ${({ theme }: any) => theme.colors.primary};
  padding-vertical: ${({ theme }: any) => theme.spacing.md}px;
  padding-horizontal: ${({ theme }: any) => theme.spacing.lg}px;
  border-radius: ${({ theme }: any) => theme.borders.radius.medium}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.lg}px;
  width: 100%;
  align-items: center;
`;

const CampaignButtonText = styled.Text`
  color: ${({ theme }: any) => theme.colors.surface};
  font-size: ${({ theme }: any) => theme.typography.sizes.large}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
`;

type CouponScreenRouteProp = RouteProp<CouponStackParamList, 'CouponDetail'>;
type CouponScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<CouponStackParamList, 'CouponDetail'>,
  BottomTabNavigationProp<MainTabParamList>
>;

interface CouponScreenProps {
  route: CouponScreenRouteProp;
  navigation: CouponScreenNavigationProp;
}

function CouponScreen({
  route,
  navigation,
}: CouponScreenProps): React.JSX.Element {
  const { couponId } = route.params;
  const theme = useTheme();
  
  // Kupon kodu açılma durumu
  const [isCodeRevealed, setIsCodeRevealed] = useState(false);

  // TanStack Query ile veri çekme
  const {
    data: coupon,
    isLoading,
    error,
  } = useCoupon(couponId);

  useEffect(() => {
    if (coupon) {
      navigation.setOptions({
        title: coupon.brand?.name || 'Kupon Detayı',
      });
    }
  }, [coupon, navigation]);

  const handleCategoryPress = (categoryId: number, categoryName?: string) => {
    navigation.navigate('CategoriesTab', {
      screen: 'CategoryDetail',
      params: { categoryId },
    });
  };

  // Helper functions
  const handleRevealCode = () => {
    setIsCodeRevealed(true);
    // Analytics tracking burada eklenebilir
  };

  const handleUTMRedirect = async () => {
    if (coupon?.campaign_url) {
      try {
        // UTM parametrelerini ekle
        const utmUrl = `${coupon.campaign_url}${coupon.campaign_url.includes('?') ? '&' : '?'}utm_source=kupon_app&utm_medium=mobile&utm_campaign=coupon_reveal&utm_content=${coupon.code}`;
        
        const canOpen = await Linking.canOpenURL(utmUrl);
        if (canOpen) {
          await Linking.openURL(utmUrl);
        } else {
          Alert.alert('Hata', 'Kampanya sayfası açılamadı.');
        }
      } catch (error) {
        Alert.alert('Hata', 'Kampanya sayfasına yönlendirilirken bir hata oluştu.');
      }
    }
  };

  const handleCopyCode = async () => {
    if (coupon?.code) {
      try {
        await Clipboard.setStringAsync(coupon.code);
        Alert.alert('Başarılı', 'Kupon kodu kopyalandı!');
      } catch (error) {
        Alert.alert('Hata', 'Kupon kodu kopyalanırken bir hata oluştu.');
      }
    }
  };

  const handleShareCode = async () => {
    if (coupon?.code) {
      try {
        const shareMessage = `${coupon.brand?.name || 'Kupon'} - İndirim Kodu: ${coupon.code}${
          coupon.campaign_url ? `\n\nKampanya: ${coupon.campaign_url}` : ''
        }`;
        
        await Share.share({
          message: shareMessage,
          title: `${coupon.brand?.name || 'Kupon'} İndirim Kodu`,
        });
      } catch (error) {
        Alert.alert('Hata', 'Kupon kodu paylaşılırken bir hata oluştu.');
      }
    }
  };

  const handleCampaignPress = async () => {
    if (coupon?.campaign_url) {
      try {
        const supported = await Linking.canOpenURL(coupon.campaign_url);
        if (supported) {
          await Linking.openURL(coupon.campaign_url);
        } else {
          Alert.alert('Hata', 'Bu bağlantı açılamıyor.');
        }
      } catch (error) {
        Alert.alert('Hata', 'Bağlantı açılırken bir hata oluştu.');
      }
    }
  };

  if (isLoading) {
    return (
      <CenteredContainer>
        <ActivityIndicator size="large" color={(theme as any).colors.primary} />
      </CenteredContainer>
    );
  }

  if (error) {
    return (
      <CenteredContainer>
        <ErrorText>{error.message || 'Kupon detayları yüklenirken bir hata oluştu.'}</ErrorText>
      </CenteredContainer>
    );
  }

  if (!coupon) {
    return (
      <CenteredContainer>
        <ErrorText>Kupon bulunamadı.</ErrorText>
      </CenteredContainer>
    );
  }

  const brandLogoUrl = coupon.brand?.logo
    ? coupon.brand.logo.startsWith('http')
      ? coupon.brand.logo
      : `${API_BASE_URL.replace('/api', '')}${coupon.brand.logo}`
    : null;

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{ paddingBottom: (theme as any).spacing.lg }}
        accessible={true}
        accessibilityLabel={coupon.brand?.name ? `${coupon.brand.name} kupon detayları` : "Kupon detayları"}>
        <ContentContainer>
          {brandLogoUrl && (
            <BrandLogo
              source={{ uri: brandLogoUrl }}
              resizeMode="contain"
              accessible={true}
              accessibilityLabel={coupon.brand?.name ? `${coupon.brand.name} logosu` : "Marka logosu"}
              accessibilityRole="image"
            />
          )}
          <BrandName
            accessible={true}
            accessibilityRole="header">
            {coupon.brand?.name}
          </BrandName>

          <CampaignTitle
            accessible={true}
            accessibilityLabel={`Kampanya: ${coupon.campaign_title || 'Kampanya Detayı'}`}>
            {coupon.campaign_title || 'Kampanya Detayı'}
          </CampaignTitle>

          {/* Kupon Kodu Gösterme */}
          {!isCodeRevealed ? (
            <RevealCodeButton
              accessible={true}
              accessibilityLabel="Kupon kodunu göster"
              onPress={handleRevealCode}>
              <RevealCodeButtonText>🎁 Kupon Kodunu Gör</RevealCodeButtonText>
              <RevealCodeHint>Koda ulaşmak için dokunun</RevealCodeHint>
            </RevealCodeButton>
          ) : (
            <CouponCodeContainer>
              <CouponCode
                accessible={true}
                accessibilityLabel={`Kupon kodu: ${coupon.code}`}>
                {coupon.code}
              </CouponCode>
              <ButtonGroup>
                <CopyButton
                  accessible={true}
                  accessibilityLabel="Kupon kodunu kopyala"
                  onPress={handleCopyCode}>
                  <Ionicons name="copy-outline" size={20} color="white" />
                </CopyButton>
                <ShareButton
                  accessible={true}
                  accessibilityLabel="Kupon kodunu paylaş"
                  onPress={handleShareCode}>
                  <Ionicons name="share-outline" size={20} color="white" />
                </ShareButton>
              </ButtonGroup>
            </CouponCodeContainer>
          )}

          {/* UTM Yönlendirme Butonu */}
          {coupon.campaign_url && (
            <UTMButton
              accessible={true}
              accessibilityLabel="Kampanyaya git"
              onPress={handleUTMRedirect}>
              <Ionicons name="rocket-outline" size={20} color="white" />
              <UTMButtonText>Kampanyaya Git</UTMButtonText>
            </UTMButton>
          )}
          <DetailsContainer>
            <DetailRow>
              <DetailLabel
                accessible={true}
                accessibilityLabel="İndirim etiketi">
                İndirim:
              </DetailLabel>
              <DetailValue
                accessible={true}
                accessibilityLabel={`İndirim değeri: ${
                  coupon.discount_type === 'percentage'
                    ? `%${coupon.discount_value}`
                    : `${coupon.discount_value} TL`
                }`}>
                {coupon.discount_type === 'percentage'
                  ? `%${coupon.discount_value}`
                  : `${coupon.discount_value} TL`}
              </DetailValue>
            </DetailRow>
            {coupon.valid_from && coupon.valid_to && 
             !isNaN(new Date(coupon.valid_from).getTime()) && 
             !isNaN(new Date(coupon.valid_to).getTime()) && (
              <DetailRow>
                <DetailLabel
                  accessible={true}
                  accessibilityLabel="Geçerlilik tarihi etiketi">
                  Geçerlilik Tarihi:
                </DetailLabel>
                <DetailValue
                  accessible={true}
                  accessibilityLabel={`Geçerlilik tarihi: ${new Date(
                    coupon.valid_from,
                  ).toLocaleDateString()} tire ${new Date(
                    coupon.valid_to,
                  ).toLocaleDateString()}`}>
                  {new Date(coupon.valid_from).toLocaleDateString()} -{' '}
                  {new Date(coupon.valid_to).toLocaleDateString()}
                </DetailValue>
              </DetailRow>
            )}
            {coupon.categories && coupon.categories.length > 0 && (
              <DetailRow>
                <DetailLabel
                  accessible={true}
                  accessibilityLabel="Kategoriler etiketi">
                  Kategoriler:
                </DetailLabel>
                <CategoriesContainer>
                  {coupon.categories.map(category => (
                    <CategoryTag
                      key={category.id}
                      accessible={true}
                      accessibilityLabel={category.name}
                      onPress={() => handleCategoryPress(category.id, category.name)}>
                      <CategoryTagText>
                        {category.name}
                      </CategoryTagText>
                    </CategoryTag>
                  ))}
                </CategoriesContainer>
              </DetailRow>
            )}
          </DetailsContainer>

          <Description
            accessible={true}
            accessibilityLabel={`Açıklama: ${coupon.description}`}>
            {coupon.description}
          </Description>
        </ContentContainer>
      </ScrollView>
    </Container>
  );
}

export default CouponScreen;
