import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BrandStackParamList,
  CouponStackParamList,
  MainTabParamList,
} from '../navigation/types';
import { fetchBrandById, fetchCouponCodes } from '../api';
import { Brand, Coupon } from '../types';
import { API_BASE_URL } from '../api/index';
import CardComponent from '../components/common/CardComponent';
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useQuery } from '@tanstack/react-query';
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

const HeaderContainer = styled.View`
  align-items: center;
  padding-vertical: ${({ theme }: any) => theme.spacing.lg}px;
  padding-horizontal: ${({ theme }: any) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: any) => theme.colors.border};
  background-color: ${({ theme }: any) => theme.colors.card};
`;

const BrandLogo = styled.Image`
  margin-bottom: ${({ theme }: any) => theme.spacing.md}px;
`;

const BrandName = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.h2.fontSize}px;
  font-weight: ${({ theme }: any) => theme.typography.h2.fontWeight};
  color: ${({ theme }: any) => theme.colors.primary};
  margin-bottom: ${({ theme }: any) => theme.spacing.xs}px;
  text-align: center;
`;

const BrandDescription = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.body.fontSize}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${({ theme }: any) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }: any) => theme.spacing.sm}px;
`;

const WebsiteLink = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.subtitle.fontSize}px;
  color: ${({ theme }: any) => theme.colors.secondary};
  font-weight: 600;
  margin-bottom: ${({ theme }: any) => theme.spacing.sm}px;
  text-decoration-line: underline;
`;

const CouponsHeader = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.h3.fontSize}px;
  font-weight: ${({ theme }: any) => theme.typography.h3.fontWeight};
  color: ${({ theme }: any) => theme.colors.text};
  padding-horizontal: ${({ theme }: any) => theme.spacing.md}px;
  padding-vertical: ${({ theme }: any) => theme.spacing.sm}px;
  background-color: ${({ theme }: any) => theme.colors.background};
  margin-bottom: ${({ theme }: any) => theme.spacing.xs}px;
`;

const CardWrapper = styled.View`
  margin-bottom: ${({ theme }: any) => theme.spacing.sm}px;
`;

const EmptyCouponsContainer = styled.View`
  padding: ${({ theme }: any) => theme.spacing.lg}px;
  align-items: center;
  flex: 1;
  justify-content: center;
`;

const NoCouponsText = styled.Text`
  text-align: center;
  margin-top: ${({ theme }: any) => theme.spacing.lg}px;
  font-size: ${({ theme }: any) => theme.typography.subtitle.fontSize}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
`;

const ErrorText = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.subtitle.fontSize}px;
  color: ${({ theme }: any) => theme.colors.error};
  text-align: center;
  padding: ${({ theme }: any) => theme.spacing.lg}px;
`;

const TouchableLink = styled.TouchableOpacity`
  margin-bottom: ${({ theme }: any) => theme.spacing.sm}px;
`;

type BrandScreenRouteProp = RouteProp<BrandStackParamList, 'BrandDetail'>;

// Combine BrandStackNavigation with MainTabNavigation for navigating to other tabs
type BrandScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<BrandStackParamList, 'BrandDetail'>,
  BottomTabNavigationProp<MainTabParamList>
>;

interface BrandScreenProps {
  route: BrandScreenRouteProp;
  navigation: BrandScreenNavigationProp;
}

function BrandScreen({
  route,
  navigation,
}: BrandScreenProps): React.JSX.Element {
  const { brandId } = route.params;
  const { width: windowWidth } = useWindowDimensions();
  const theme = useTheme();
  
  // Calculate responsive values
  const numColumns = windowWidth < 600 ? 2 : 3;
  const logoSize = windowWidth * 0.3;
  const logoHeight = logoSize * 0.5;

  const {
    data: brand,
    isLoading: brandLoading,
    error: brandError,
  } = useQuery<Brand, Error>({
    queryKey: ['brand', brandId],
    queryFn: () => fetchBrandById(brandId),
  });

  const {
    data: coupons,
    isLoading: couponsLoading,
    error: couponsError,
  } = useQuery<Coupon[], Error>({
    queryKey: ['coupons', 'brand', brandId],
    queryFn: () => fetchCouponCodes({ brand_id: brandId }),
    enabled: !!brand,
  });

  useEffect(() => {
    if (brand) {
      navigation.setOptions({ title: brand.name || 'Marka Detayı' });
    }
  }, [brand, navigation]);

  const handleCouponPress = (couponId: number) => {
    navigation.navigate('CouponsTab', {
      screen: 'CouponDetail',
      params: { couponId },
    } as NavigatorScreenParams<CouponStackParamList>);
  };

  const handleWebsitePress = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const isLoading = brandLoading || couponsLoading;
  const error = brandError || couponsError;

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
        <ErrorText>
          {error.message || 'Veri yüklenirken bir hata oluştu.'}
        </ErrorText>
      </CenteredContainer>
    );
  }

  if (!brand) {
    return (
      <CenteredContainer>
        <ErrorText>Marka bulunamadı.</ErrorText>
      </CenteredContainer>
    );
  }

  const brandLogoUrl = brand.logo
    ? brand.logo.startsWith('http') || brand.logo.startsWith('https')
      ? brand.logo
      : `${API_BASE_URL.replace('/api', '')}${brand.logo}`
    : null;

  return (
    <Container>
      <FlatList
        ListHeaderComponent={
          <>
            <HeaderContainer>
              {brandLogoUrl && (
                <BrandLogo
                  source={{ uri: brandLogoUrl }}
                  style={{
                    width: logoSize,
                    height: logoHeight,
                  }}
                  resizeMode="contain"
                />
              )}
              <BrandName>{brand.name}</BrandName>
              {brand.description && (
                <BrandDescription>{brand.description}</BrandDescription>
              )}
              {brand.website_url && (
                <TouchableLink
                  onPress={() => handleWebsitePress(brand.website_url!)}>
                  <WebsiteLink>Website Git</WebsiteLink>
                </TouchableLink>
              )}
            </HeaderContainer>
            {coupons && coupons.length > 0 && (
              <CouponsHeader>Bu Markaya Ait Kuponlar</CouponsHeader>
            )}
          </>
        }
        data={coupons || []}
        renderItem={({ item }) => (
          <CardWrapper>
            <CardComponent
              item={{ ...item, type: 'coupon' }}
              onPress={() => handleCouponPress(item.id)}
            />
          </CardWrapper>
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginHorizontal: 0,
        }}
        contentContainerStyle={{
          paddingBottom: (theme as any).spacing.sm,
          paddingHorizontal: (theme as any).spacing.md,
        }}
        ListEmptyComponent={
          !isLoading && (!coupons || coupons.length === 0) ? (
            <EmptyCouponsContainer>
              <NoCouponsText>
                Bu markaya ait aktif kupon bulunmamaktadır.
              </NoCouponsText>
            </EmptyCouponsContainer>
          ) : null
        }
      />
    </Container>
  );
}

export default BrandScreen;
