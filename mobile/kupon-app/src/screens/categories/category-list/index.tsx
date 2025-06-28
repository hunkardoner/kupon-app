import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { CategoryStackParamList } from '../../../navigation/types';
import { Category } from '../../../types';
import { useCategories } from '../../../hooks/useQueries';
import { styles } from './style';

// Types
type CategoryListScreenRouteProp = RouteProp<CategoryStackParamList, 'CategoryList'>;
type CategoryListScreenNavigationProp = StackNavigationProp<CategoryStackParamList, 'CategoryList'>;

interface CategoryListScreenProps {
  route: CategoryListScreenRouteProp;
  navigation: CategoryListScreenNavigationProp;
}

const CategoryListScreen: React.FC<CategoryListScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useCategories();

  const filteredCategories = categories?.filter(category =>
    !searchQuery?.trim() || (category.name && category.name.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleCategoryPress = (categoryId: number) => {
    navigation.navigate('CategoryDetail', { categoryId });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerTitle}>Kategoriler</Text>
          <Text style={styles.headerSubtitle}>
            {filteredCategories.length} kategori bulundu
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.filterButton, styles.disabledButton]}
          disabled={true}
        >
          <Ionicons name="options-outline" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Kategori ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderCategoryItem = ({ item }: { item: Category }) => {
    const couponCount = item.coupons_count || 0;
    const isHot = couponCount > 10;
    const isNew = item.id % 3 === 0; // Mock logic for new categories

    return (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => handleCategoryPress(item.id)}
        activeOpacity={0.7}
      >
        {(isHot || isNew) && (
          <View style={[styles.badge, isHot ? styles.hotBadge : styles.newBadge]}>
            <Text style={styles.badgeText}>
              {isHot ? 'HOT' : 'NEW'}
            </Text>
          </View>
        )}
        
        <View style={styles.categoryIcon}>
          <Ionicons 
            name="library-outline" 
            size={24} 
            color="#2196F3" 
          />
        </View>
        
        <Text style={styles.categoryName} numberOfLines={2}>
          {item.name}
        </Text>
        
        <Text style={styles.couponCount}>
          {couponCount} kupon
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="library-outline" size={40} color="#ccc" />
      </View>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'Aradığınız kategori bulunamadı' : 'Henüz kategori bulunmuyor'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? 'Farklı anahtar kelimeler deneyebilirsiniz'
          : 'Yeni kategoriler yakında eklenecek'
        }
      </Text>
      {searchQuery && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setSearchQuery('')}
        >
          <Text style={styles.retryButtonText}>Aramayı Temizle</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2196F3" />
      <Text style={styles.loadingText}>Kategoriler yükleniyor...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={48} color="#f44336" />
      <Text style={styles.errorTitle}>Bir hata oluştu</Text>
      <Text style={styles.errorSubtitle}>
        {error?.message || 'Kategoriler yüklenirken bir sorun yaşandı'}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
        <Text style={styles.retryButtonText}>Tekrar Dene</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item: Category) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={filteredCategories.length > 0 ? styles.gridContainer : undefined}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={null}
      />
    </SafeAreaView>
  );
};

export default CategoryListScreen;
