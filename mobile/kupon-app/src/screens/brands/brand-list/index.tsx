import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { BrandStackParamList } from '../../../navigation/types';
import { Brand } from '../../../types';
import { useBrands } from '../../../hooks/useQueries';
import { AlphabetFilterModal } from '../../../components/common/alphabet-filter-modal';
import { API_BASE_URL } from '../../../api/index';
import { styles } from './style';

const { width } = Dimensions.get('window');

// Types
type BrandListScreenRouteProp = RouteProp<BrandStackParamList, 'BrandList'>;
type BrandListScreenNavigationProp = StackNavigationProp<BrandStackParamList, 'BrandList'>;

interface BrandListScreenProps {
  route: BrandListScreenRouteProp;
  navigation: BrandListScreenNavigationProp;
}

const BrandListScreen: React.FC<BrandListScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [alphabetFilterVisible, setAlphabetFilterVisible] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const {
    data: brands,
    isLoading,
    error,
    refetch,
  } = useBrands(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredBrands = brands?.filter(brand => {
    // Search query filter
    const matchesSearch = !searchQuery?.trim() || 
      (brand.name && brand.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Letter filter
    const matchesLetter = selectedLetter === null || 
      (brand.name && brand.name.toUpperCase().startsWith(selectedLetter));
    
    return matchesSearch && matchesLetter;
  }) || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleBrandPress = (brandId: number) => {
    navigation.navigate('BrandDetail', { brandId });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerTitle}>Markalar</Text>
          <Text style={styles.headerSubtitle}>
            {filteredBrands.length} marka bulundu
          </Text>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setAlphabetFilterVisible(true)}
        >
          <Ionicons name="filter" size={24} color={selectedLetter ? "#2196F3" : "#666"} />
          {selectedLetter && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{selectedLetter}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Marka ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
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

  const renderBrandItem = ({ item, index }: { item: Brand; index: number }) => {
    // Debug brand logo data
    console.log('Brand item logo data:', {
      id: item.id,
      name: item.name,
      logo: item.logo,
      logo_type: typeof item.logo,
    });

    // Logo URL'sini güvenli şekilde al
    const logoUrl = item.logo; // API'den zaten tam URL geliyor
    console.log('Final logo URL for brand', item.id, ':', logoUrl);

    return (
      <TouchableOpacity
        style={styles.brandItem}
        onPress={() => handleBrandPress(item.id)}
      >
        <Image
          source={{
            uri: logoUrl || 'https://www.kuponcepte.com.tr/storage/brands/default-brand-logo.png'
          }}
          style={styles.brandImage}
          resizeMode="contain"
          onError={(error) => {
            console.log('Brand image load error for brand', item.id, ':', error.nativeEvent.error);
          }}
          onLoad={() => {
            console.log('Brand image loaded successfully for brand', item.id);
          }}
        />
        
        <Text style={styles.brandName} numberOfLines={1}>
          {item.name}
        </Text>
        
        <View style={styles.brandStats}>
          {item.category && (
            <Text style={styles.categoryText} numberOfLines={1}>
              {item.category}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Ionicons name="storefront-outline" size={48} color="#adb5bd" />
      </View>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'Aradığınız marka bulunamadı' : 'Henüz marka bulunmuyor'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? 'Farklı anahtar kelimeler deneyebilirsiniz'
          : 'Yeni markalar yakında eklenecek'
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
      <ActivityIndicator size="large" color="#007bff" />
      <Text style={styles.loadingText}>Markalar yükleniyor...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={64} color="#dc3545" />
      <Text style={styles.errorTitle}>Bir hata oluştu</Text>
      <Text style={styles.errorSubtitle}>
        {error?.message || 'Markalar yüklenirken bir sorun yaşandı'}
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
        data={filteredBrands}
        renderItem={renderBrandItem}
        keyExtractor={(item: Brand) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      
      <AlphabetFilterModal
        visible={alphabetFilterVisible}
        onClose={() => setAlphabetFilterVisible(false)}
        onSelectLetter={setSelectedLetter}
        selectedLetter={selectedLetter}
      />
    </SafeAreaView>
  );
};

export default BrandListScreen;
