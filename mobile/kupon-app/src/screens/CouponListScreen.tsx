import React, { useMemo, useCallback } from 'react';
import {
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CouponStackParamList } from '../navigation/types';
import { Coupon } from '../types';
import CardComponent from '../components/common/CardComponent';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { useCoupons } from '../hooks/useQueries';
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

const CouponListScreen: React.FC<CouponListScreenProps> = React.memo(({
  navigation,
}) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();

  // Memoized responsive columns calculation
  const layoutConfig = useMemo(() => {
    const numColumns = width < 600 ? 2 : 3;
    const cardWidth = (width - (numColumns + 1) * theme.spacing.md) / numColumns;
    return { numColumns, cardWidth };
  }, [width, theme.spacing.md]);

  const {
    data: coupons,
    isLoading,
    error,
  } = useCoupons();

  // Memoized navigation handler
  const handleCouponPress = useCallback((couponId: number) => {
    navigation.navigate('CouponDetail', { couponId: couponId });
  }, [navigation]);

  // Memoized render function
  const renderCouponItem = useCallback(({ item }: { item: Coupon }) => (
    <CardContainer width={layoutConfig.cardWidth}>
      <CardComponent
        item={{ ...item, type: 'coupon' }}
        onPress={() => handleCouponPress(item.id)}
      />
    </CardContainer>
  ), [layoutConfig.cardWidth, handleCouponPress]);

  // Memoized key extractor
  const keyExtractor = useCallback((item: Coupon) => item.id.toString(), []);

  // Memoized column wrapper style
  const columnWrapperStyle = useMemo(() => 
    layoutConfig.numColumns > 1 ? {
      justifyContent: 'space-around' as const,
      paddingHorizontal: theme.spacing.sm,
    } : undefined,
    [layoutConfig.numColumns, theme.spacing.sm]
  );

  // Memoized content container style
  const contentContainerStyle = useMemo(() => ({ 
    padding: theme.spacing.sm 
  }), [theme.spacing.sm]);

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner message="Kuponlar yükleniyor..." fullScreen />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorDisplay
          error={error}
          message="Kuponlar yüklenirken bir hata oluştu"
        />
      </Container>
    );
  }

  return (
    <Container>
      {coupons && coupons.length > 0 ? (
        <FlatList
          data={coupons}
          renderItem={renderCouponItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={contentContainerStyle}
          numColumns={layoutConfig.numColumns}
          columnWrapperStyle={columnWrapperStyle}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          getItemLayout={undefined} // Auto calculate for performance
        />
      ) : (
        <CenteredContainer>
          <EmptyText>Kupon bulunamadı.</EmptyText>
        </CenteredContainer>
      )}
    </Container>
  );
});

// Display name for better debugging
CouponListScreen.displayName = 'CouponListScreen';

export default CouponListScreen;
