import React from 'react';
import {
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BrandStackParamList } from '../navigation/types';
import { fetchBrands } from '../api';
import { Brand } from '../types';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../api/index';

// Types
type BrandListScreenRouteProp = RouteProp<BrandStackParamList, 'BrandList'>;
type BrandListScreenNavigationProp = StackNavigationProp<BrandStackParamList, 'BrandList'>;

interface BrandListScreenProps {
  route: BrandListScreenRouteProp;
  navigation: BrandListScreenNavigationProp;
}

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

const BrandItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }: any) => theme.spacing.md}px;
  margin-horizontal: ${({ theme }: any) => theme.spacing.md}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.sm}px;
  background-color: ${({ theme }: any) => theme.colors.card};
  border-radius: ${({ theme }: any) => theme.borders.radius.medium}px;
  border-width: 1px;
  border-color: ${({ theme }: any) => theme.colors.border};
  shadow-color: ${({ theme }: any) => theme.colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const BrandLogo = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: ${({ theme }: any) => theme.spacing.md}px;
  background-color: ${({ theme }: any) => theme.colors.border};
`;

const BrandInfo = styled.View`
  flex: 1;
`;

const BrandName = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.h3.fontSize}px;
  font-weight: ${({ theme }: any) => theme.typography.h3.fontWeight};
  color: ${({ theme }: any) => theme.colors.text};
  margin-bottom: ${({ theme }: any) => theme.spacing.xs}px;
`;

const BrandDescription = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.body.fontSize}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
  line-height: 20px;
`;

const CouponsCount = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.caption.fontSize}px;
  color: ${({ theme }: any) => theme.colors.primary};
  font-weight: 600;
  margin-top: ${({ theme }: any) => theme.spacing.xs}px;
`;

const ErrorText = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.subtitle.fontSize}px;
  color: ${({ theme }: any) => theme.colors.error};
  text-align: center;
  padding: ${({ theme }: any) => theme.spacing.lg}px;
`;

const EmptyStateContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }: any) => theme.spacing.lg}px;
`;

const EmptyStateText = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.subtitle.fontSize}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
  text-align: center;
  margin-top: ${({ theme }: any) => theme.spacing.md}px;
`;

const BrandListScreen: React.FC<BrandListScreenProps> = ({ navigation }) => {
  const { width } = useWindowDimensions();

  const {
    data: brands,
    isLoading,
    error,
    refetch,
  } = useQuery<Brand[], Error>({
    queryKey: ['brands'],
    queryFn: () => fetchBrands(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleBrandPress = (brandId: number) => {
    navigation.navigate('BrandDetail', { brandId });
  };

  const renderBrandItem = ({ item }: { item: Brand }) => {
    // Handle logo URL formatting
    let logoUrl = item.logo;
    if (logoUrl && !logoUrl.startsWith('http')) {
      logoUrl = `${API_BASE_URL.replace('/api', '')}${logoUrl}`;
    }

    return (
      <BrandItem onPress={() => handleBrandPress(item.id)}>
        {logoUrl ? (
          <BrandLogo
            source={{ uri: logoUrl }}
            resizeMode="cover"
          />
        ) : (
          <BrandLogo
            source={{ uri: 'https://via.placeholder.com/60x60?text=Logo' }}
            resizeMode="cover"
          />
        )}
        <BrandInfo>
          <BrandName numberOfLines={1}>{item.name}</BrandName>
          {item.description && (
            <BrandDescription numberOfLines={2}>
              {item.description}
            </BrandDescription>
          )}
          {item.coupons_count !== undefined && (
            <CouponsCount>
              {item.coupons_count > 0 
                ? `${item.coupons_count} aktif kupon` 
                : 'Henüz kupon yok'
              }
            </CouponsCount>
          )}
        </BrandInfo>
      </BrandItem>
    );
  };

  if (isLoading) {
    return (
      <CenteredContainer>
        <ActivityIndicator size="large" color="#007AFF" />
      </CenteredContainer>
    );
  }

  if (error) {
    return (
      <CenteredContainer>
        <ErrorText>
          {error.message || 'Markalar yüklenirken bir hata oluştu.'}
        </ErrorText>
      </CenteredContainer>
    );
  }

  if (!brands || brands.length === 0) {
    return (
      <Container>
        <EmptyStateContainer>
          <EmptyStateText>
            Henüz hiçbir marka bulunmamaktadır.
          </EmptyStateText>
        </EmptyStateContainer>
      </Container>
    );
  }

  return (
    <Container>
      <FlatList
        data={brands}
        renderItem={renderBrandItem}
        keyExtractor={(item: Brand) => item.id.toString()}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </Container>
  );
};

export default BrandListScreen;