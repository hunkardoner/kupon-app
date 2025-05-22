import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CategoryStackParamList } from '../navigation/types';
import { fetchCategories } from '../api';
import { Category } from '../types';
import CardComponent from '../components/common/CardComponent';
import COLORS from '../constants/colors';
import styles from './CategoryListScreen.styles';
import { useQuery } from '@tanstack/react-query';

type CategoryListScreenNavigationProp = StackNavigationProp<
  CategoryStackParamList,
  'CategoryList'
>;

const CategoryListScreen: React.FC = () => {
  const navigation = useNavigation<CategoryListScreenNavigationProp>();

  const {
    data: categories,
    isLoading: loading,
    error,
  } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('CategoryDetail', { categoryId: category.id });
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={styles.centered}
      />
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Kategoriler yüklenirken bir hata oluştu: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <CardComponent
            item={{ ...item, type: 'category' }}
            onPress={() => handleCategoryPress(item)}
            style={styles.card}
          />
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

export default CategoryListScreen;
