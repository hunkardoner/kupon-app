import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
} from 'react-native';
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
  font-size: 26px;
  font-weight: bold;
  color: ${({ theme }: any) => theme.colors.primary};
  margin-bottom: ${({ theme }: any) => theme.spacing.sm}px;
  text-align: center;
`;

const CouponCodeLabel = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.subtitle.fontSize}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
  margin-top: ${({ theme }: any) => theme.spacing.md}px;
`;

const CouponCode = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${({ theme }: any) => theme.colors.primary};
  padding-vertical: ${({ theme }: any) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }: any) => theme.spacing.lg}px;
  background-color: ${({ theme }: any) => theme.colors.border};
  border-radius: ${({ theme }: any) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.lg}px;
  text-align: center;
`;

const Description = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.subtitle.fontSize}px;
  color: ${({ theme }: any) => theme.colors.text};
  text-align: center;
  padding-horizontal: ${({ theme }: any) => theme.spacing.sm}px;
`;

const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-vertical: ${({ theme }: any) => theme.spacing.xs}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: any) => theme.colors.border};
`;

const DetailLabel = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.subtitle.fontSize}px;
  font-weight: 600;
  color: ${({ theme }: any) => theme.colors.text};
`;

const DetailValue = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.subtitle.fontSize}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
  flex-shrink: 1;
  margin-bottom: ${({ theme }: any) => theme.spacing.lg}px;
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
  margin-left: ${({ theme }: any) => theme.spacing.xs}px;
`;

const CategoryTag = styled.Text`
  background-color: ${({ theme }: any) => theme.colors.primary};
  color: ${({ theme }: any) => theme.colors.white};
  padding-horizontal: ${({ theme }: any) => theme.spacing.xs}px;
  padding-vertical: 4px;
  border-radius: 4px;
  margin-right: 4px;
  margin-bottom: 4px;
  font-size: 12px;
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
          <CouponCode
            accessible={true}
            accessibilityLabel={`Kupon kodu: ${coupon.code}`}>
            {coupon.code}
          </CouponCode>
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
          <Description
            accessible={true}
            accessibilityLabel={`Açıklama: ${coupon.description}`}>
            {coupon.description}
          </Description>
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
        </ContentContainer>
      </ScrollView>
    </Container>
  );
}

export default CouponScreen;
