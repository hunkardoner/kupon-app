import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { dataAPI } from '../../api';
import { Coupon } from '../../types';
import { RootStackParamList } from '../../navigation/types';
import { CouponCard } from '../../components/common/coupon-card';
import { styles } from './style';

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Uyarı', 'Lütfen arama terimi girin');
      return;
    }

    try {
      setIsLoading(true);
      const results = await dataAPI.search(searchQuery.trim());
      setSearchResults(results.data || []);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Hata', 'Arama yapılırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  const renderCouponItem = ({ item }: { item: Coupon }) => (
    <CouponCard
      item={item}
      onPress={(couponId) => navigation.navigate('CouponDetail', { couponId })}
    />
  );

  const renderEmptyState = () => {
    if (!hasSearched) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Kupon Arayın</Text>
          <Text style={styles.emptySubtitle}>
            Yukarıdaki arama kutusunu kullanarak istediğiniz kuponları bulabilirsiniz
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>Sonuç Bulunamadı</Text>
        <Text style={styles.emptySubtitle}>
          "{searchQuery}" için herhangi bir kupon bulunamadı
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kupon Ara</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Kupon, marka veya kategori ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.searchButton, { opacity: searchQuery.trim() ? 1 : 0.5 }]}
          onPress={handleSearch}
          disabled={!searchQuery.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.searchButtonText}>Ara</Text>
          )}
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Aranıyor...</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderCouponItem}
          keyExtractor={(item) => item.id.toString()}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
