import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Share,
  Dimensions,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Clipboard from 'expo-clipboard';
import { CouponStackParamList } from '../navigation/types';
import { Coupon } from '../types';
import { API_BASE_URL, dataAPI } from '../api/index';
import { useFavorites } from '../context/FavoritesContext';

const { width, height } = Dimensions.get('window');

type CouponScreenRouteProp = RouteProp<CouponStackParamList, 'CouponDetail'>;
type CouponScreenNavigationProp = StackNavigationProp<CouponStackParamList, 'CouponDetail'>;

interface CouponScreenProps {
  route: CouponScreenRouteProp;
  navigation: CouponScreenNavigationProp;
}

const CouponScreen: React.FC<CouponScreenProps> = ({ route, navigation }) => {
  const { couponId } = route.params;
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const isFavorite = coupon ? favorites.includes(coupon.id.toString()) : false;

  useEffect(() => {
    loadCoupon();
  }, [couponId]);
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
// Component starts here
const CouponScreen: React.FC<CouponScreenProps> = ({ route, navigation }) => {
  const { couponId } = route.params;
  
  // State definitions
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
