import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CouponStackParamList } from '../navigation/types';
import { fetchCouponCodeById } from '../api';
import { Coupon } from '../types';
import { API_BASE_URL } from '../api/index';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';

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
  flex: 1;
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

const CategoryTag = styled.Text`
  background-color: ${({ theme }: any) => theme.colors.primary};
  color: ${({ theme }: any) => theme.colors.surface};
  padding-horizontal: ${({ theme }: any) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }: any) => theme.spacing.xs}px;
  border-radius: ${({ theme }: any) => theme.borders.radius.small}px;
  margin-left: ${({ theme }: any) => theme.spacing.xs}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.xs}px;
  font-size: ${({ theme }: any) => theme.typography.sizes.small}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.medium};
`;

const CouponCodeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }: any) => theme.spacing.md}px;
  width: 100%;
`;

const CopyButton = styled.TouchableOpacity`
  background-color: ${({ theme }: any) => theme.colors.secondary};
  padding: ${({ theme }: any) => theme.spacing.sm}px;
  border-radius: ${({ theme }: any) => theme.borders.radius.small}px;
  margin-left: ${({ theme }: any) => theme.spacing.md}px;
`;

const CopyButtonText = styled.Text`
  color: ${({ theme }: any) => theme.colors.surface};
  font-size: ${({ theme }: any) => theme.typography.sizes.small}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.medium};
`;

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
type CouponScreenNavigationProp = StackNavigationProp<
  CouponStackParamList,
  'CouponDetail'
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
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  // Helper functions
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

  useEffect(() => {
    const loadCoupon = async () => {
      try {
        setLoading(true);
        const fetchedCoupon = await fetchCouponCodeById(couponId);
        setCoupon(fetchedCoupon);
        navigation.setOptions({
          title: fetchedCoupon.brand?.name || 'Kupon Detayı',
        });
        setError(null);
      } catch (e) {
        console.error('Failed to fetch coupon details', e);
        setError('Kupon detayları yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    loadCoupon();
  }, [couponId, navigation]);

  if (loading) {
    return (
      <CenteredContainer>
        <ActivityIndicator size="large" color={(theme as any).colors.primary} />
      </CenteredContainer>
    );
  }

  if (error) {
    return (
      <CenteredContainer>
        <ErrorText>{error}</ErrorText>
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
          <CouponCodeLabel>Kupon Kodu:</CouponCodeLabel>
          <CouponCodeContainer>
            <CouponCode
              accessible={true}
              accessibilityLabel={`Kupon kodu: ${coupon.code}`}>
              {coupon.code}
            </CouponCode>
            <CopyButton
              accessible={true}
              accessibilityLabel="Kupon kodunu kopyala"
              onPress={handleCopyCode}>
              <CopyButtonText>Kopyala</CopyButtonText>
            </CopyButton>
          </CouponCodeContainer>
          
          {coupon.campaign_url && (
            <CampaignButton
              accessible={true}
              accessibilityLabel="Kampanyaya git"
              onPress={handleCampaignPress}>
              <CampaignButtonText>
                🚀 Kampanyaya Git
              </CampaignButtonText>
            </CampaignButton>
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
            <DetailRow>
              <DetailLabel
                accessible={true}
                accessibilityLabel="Geçerlilik tarihi etiketi">
                Geçerlilik Tarihi:
              </DetailLabel>
              <DetailValue
                accessible={true}
                accessibilityLabel={`Geçerlilik tarihi: ${new Date(
                  coupon.start_date,
                ).toLocaleDateString()} tire ${new Date(
                  coupon.end_date,
                ).toLocaleDateString()}`}>
                {new Date(coupon.start_date).toLocaleDateString()} -{' '}
                {new Date(coupon.end_date).toLocaleDateString()}
              </DetailValue>
            </DetailRow>
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
                      accessibilityLabel={category.name}>
                      {category.name}
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
