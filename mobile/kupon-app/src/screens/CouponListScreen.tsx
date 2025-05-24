import React from 'react';
import {
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CouponStackParamList } from '../navigation/types';
import { Coupon } from '../types';
import { fetchCouponCodes } from '../api';
import CardComponent from '../components/common/CardComponent';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../theme';

// Styled Components
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.background};
`;

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }: any) => theme.spacing.large}px;
`;

const LoadingText = styled.Text`
  margin-top: ${({ theme }: any) => theme.spacing.small}px;
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  color: ${({ theme }: any) => theme.colors.text};
`;

const ErrorText = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  color: ${({ theme }: any) => theme.colors.error};
  text-align: center;
`;

const EmptyText = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
  text-align: center;
`;

const CardContainer = styled.View<{ width: number }>`
  width: ${({ width }: any) => width}px;
  padding: ${({ theme }: any) => theme.spacing.xs}px;
`;

// Tip tanımlamaları
type CouponListScreenNavigationProp = StackNavigationProp<
  CouponStackParamList,
  'CouponList'
>;

interface CouponListScreenProps {
  navigation: CouponListScreenNavigationProp;
}

function CouponListScreen({
  navigation,
}: CouponListScreenProps): React.JSX.Element {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();

  // Responsive columns
  const numColumns = width < 600 ? 2 : 3;
  const cardWidth = (width - (numColumns + 1) * theme.spacing.md) / numColumns;

  const {
    data: coupons,
    isLoading,
    error,
  } = useQuery<Coupon[], Error>({
    queryKey: ['coupons'],
    queryFn: () => fetchCouponCodes(),
  });

  const handleCouponPress = (couponId: number) => {
    navigation.navigate('CouponDetail', { couponId: couponId });
  };

  const renderCouponItem = ({ item }: { item: Coupon }) => (
    <CardContainer width={cardWidth}>
      <CardComponent
        item={{ ...item, type: 'coupon' }}
        onPress={() => handleCouponPress(item.id)}
      />
    </CardContainer>
  );

  if (isLoading) {
    return (
      <Container>
        <CenteredContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <LoadingText>Yükleniyor...</LoadingText>
        </CenteredContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <CenteredContainer>
          <ErrorText>
            Kuponlar yüklenirken bir hata oluştu: {error.message}
          </ErrorText>
        </CenteredContainer>
      </Container>
    );
  }

  return (
    <Container>
      {coupons && coupons.length > 0 ? (
        <FlatList
          data={coupons}
          renderItem={renderCouponItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: theme.spacing.sm }}
          numColumns={numColumns}
          columnWrapperStyle={
            numColumns > 1
              ? {
                  justifyContent: 'space-around',
                  paddingHorizontal: theme.spacing.sm,
                }
              : undefined
          }
        />
      ) : (
        <CenteredContainer>
          <EmptyText>Kupon bulunamadı.</EmptyText>
        </CenteredContainer>
      )}
    </Container>
  );
}

export default CouponListScreen;
