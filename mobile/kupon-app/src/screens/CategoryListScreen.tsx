import React from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CategoryStackParamList } from '../navigation/types';
import { Category } from '../types';
import CardComponent from '../components/common/CardComponent';
import { useCategories } from '../hooks/useQueries';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorDisplay from '../components/common/ErrorDisplay';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.background};
`;

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.Text`
  color: ${({ theme }: any) => theme.colors.error};
  font-size: ${({ theme }: any) => theme.typography.subtitle.fontSize}px;
  text-align: center;
  margin-horizontal: ${({ theme }: any) => theme.spacing.lg}px;
`;

type CategoryListScreenNavigationProp = StackNavigationProp<
  CategoryStackParamList,
  'CategoryList'
>;

const CategoryListScreen: React.FC = () => {
  const navigation = useNavigation<CategoryListScreenNavigationProp>();
  const theme = useTheme();

  const {
    data: categories,
    isLoading: loading,
    error,
    refetch,
  } = useCategories();

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('CategoryDetail', { categoryId: category.id });
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Kategoriler yükleniyor..." />;
  }

  if (error) {
    return (
      <ErrorDisplay 
        error={error} 
        onRetry={refetch}
        fullScreen
        message="Kategoriler yüklenirken bir hata oluştu."
      />
    );
  }

  return (
    <Container>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CardComponent
            item={{ ...item, type: 'category' }}
            onPress={() => handleCategoryPress(item)}
            style={{
              flex: 1,
              margin: (theme as any).spacing.xs,
              maxWidth: '45%',
            }}
          />
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: (theme as any).spacing.xs,
          paddingVertical: (theme as any).spacing.md,
        }}
        columnWrapperStyle={{
          justifyContent: 'space-between',
        }}
      />
    </Container>
  );
};

export default CategoryListScreen;
