import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import styled from 'styled-components/native';
import { CategoryStackParamList } from '../navigation/types';
import { fetchCategoryById } from '../api';
import { Category, Coupon } from '../types';
import CardComponent from '../components/common/CardComponent';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CouponStackParamList, MainTabParamList } from '../navigation/types';
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../theme';

// Styled Components
const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.background};
`;

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }: any) => theme.spacing.large}px;
`;

const ErrorText = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  color: ${({ theme }: any) => theme.colors.error};
  text-align: center;
`;

const HeaderContainer = styled.View`
  margin-bottom: ${({ theme }: any) => theme.spacing.large}px;
`;

const CategoryImage = styled.Image`
  width: 100%;
  height: 200px;
  margin-bottom: ${({ theme }: any) => theme.spacing.medium}px;
`;

const HeaderTextContainer = styled.View`
  padding-horizontal: ${({ theme }: any) => theme.spacing.medium}px;
`;

const CategoryTitle = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.xl}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  color: ${({ theme }: any) => theme.colors.text};
  margin-bottom: ${({ theme }: any) => theme.spacing.small}px;
`;

const CategoryDescription = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
  line-height: 22px;
`;

const CouponsSection = styled.View`
  padding-horizontal: ${({ theme }: any) => theme.spacing.medium}px;
`;

const SectionTitle = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.large}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  color: ${({ theme }: any) => theme.colors.text};
  margin-bottom: ${({ theme }: any) => theme.spacing.medium}px;
`;

const NoCouponsContainer = styled.View`
  padding: ${({ theme }: any) => theme.spacing.large}px;
  align-items: center;
`;

const NoCouponsText = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
  text-align: center;
`;

type CategoryScreenRouteProp = RouteProp<
  CategoryStackParamList,
  'CategoryDetail'
>;

// Define navigation prop type for CategoryScreen
type CategoryScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<CategoryStackParamList, 'CategoryDetail'>,
  BottomTabNavigationProp<MainTabParamList>
>;

const CategoryScreen: React.FC = () => {
  const route = useRoute<CategoryScreenRouteProp>();
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const { categoryId } = route.params;
  const { width } = useWindowDimensions();
  const { theme } = useTheme();

  const {
    data: category,
    isLoading: loading,
    error,
  } = useQuery<Category, Error>({
    queryKey: ['category', categoryId],
    queryFn: () => fetchCategoryById(categoryId),
  });

  // Coupons are part of the category data
  const coupons = category?.coupon_codes || [];

  const handleCouponPress = (couponId: number) => {
    navigation.navigate('CouponsTab', {
      screen: 'CouponDetail',
      params: { couponId },
    } as NavigatorScreenParams<CouponStackParamList>);
  };

  if (loading) {
    return (
      <CenteredContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </CenteredContainer>
    );
  }

  if (error || !category) {
    return (
      <CenteredContainer>
        <ErrorText>
          {error?.message || 'Kategori bulunamadı.'}
        </ErrorText>
      </CenteredContainer>
    );
  }

  return (
    <Container>
      <HeaderContainer>
        {category.image && (
          <CategoryImage
            source={{ uri: category.image }}
            resizeMode="cover"
          />
        )}
        <HeaderTextContainer>
          <CategoryTitle>{category.name}</CategoryTitle>
          {category.description && (
            <CategoryDescription>
              {category.description}
            </CategoryDescription>
          )}
        </HeaderTextContainer>
      </HeaderContainer>

      {coupons.length > 0 ? (
        <CouponsSection>
          <SectionTitle>Bu Kategorideki Kuponlar</SectionTitle>
          <FlatList
            data={coupons}
            renderItem={({ item }) => (
              <CardComponent
                item={{ ...item, type: 'coupon' }}
                onPress={() => handleCouponPress(item.id)}
              />
            )}
            keyExtractor={item => item.id.toString()}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </CouponsSection>
      ) : (
        <NoCouponsContainer>
          <NoCouponsText>
            Bu kategoride henüz kupon bulunmamaktadır.
          </NoCouponsText>
        </NoCouponsContainer>
      )}
    </Container>
  );
};

export default CategoryScreen;
