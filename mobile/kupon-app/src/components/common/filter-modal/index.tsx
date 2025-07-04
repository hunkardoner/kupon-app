import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

export interface FilterOptions {
  discountType?: 'percentage' | 'fixed' | 'all';
  category?: string;
  brand?: string;
  minDiscount?: number;
  maxDiscount?: number;
  onlyAvailable?: boolean;
  sortBy?: 'newest' | 'popular' | 'ending' | 'discount';
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
  categories?: Array<{ id: number; name: string }>;
  brands?: Array<{ id: number; name: string }>;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters,
  categories = [],
  brands = [],
}) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      discountType: 'all',
      sortBy: 'newest',
      onlyAvailable: true,
    };
    setFilters(resetFilters);
  };

  const discountTypes = [
    { value: 'all', label: 'Tümü' },
    { value: 'percentage', label: 'Yüzde İndirim' },
    { value: 'fixed', label: 'Sabit İndirim' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'En Yeni' },
    { value: 'popular', label: 'En Popüler' },
    { value: 'ending', label: 'Süre Bitiyor' },
    { value: 'discount', label: 'İndirim Miktarı' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Filtrele</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetText}>Sıfırla</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Sıralama */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sıralama</Text>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionItem,
                  filters.sortBy === option.value && styles.selectedOption,
                ]}
                onPress={() => setFilters({ ...filters, sortBy: option.value as any })}
              >
                <Text
                  style={[
                    styles.optionText,
                    filters.sortBy === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
                {filters.sortBy === option.value && (
                  <Ionicons name="checkmark" size={20} color="#2196F3" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* İndirim Türü */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İndirim Türü</Text>
            {discountTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.optionItem,
                  filters.discountType === type.value && styles.selectedOption,
                ]}
                onPress={() => setFilters({ ...filters, discountType: type.value as any })}
              >
                <Text
                  style={[
                    styles.optionText,
                    filters.discountType === type.value && styles.selectedOptionText,
                  ]}
                >
                  {type.label}
                </Text>
                {filters.discountType === type.value && (
                  <Ionicons name="checkmark" size={20} color="#2196F3" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Kategoriler */}
          {categories.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kategoriler</Text>
              {categories.slice(0, 8).map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.optionItem,
                    filters.category === category.id.toString() && styles.selectedOption,
                  ]}
                  onPress={() => setFilters({ 
                    ...filters, 
                    category: filters.category === category.id.toString() ? undefined : category.id.toString() 
                  })}
                >
                  <Text
                    style={[
                      styles.optionText,
                      filters.category === category.id.toString() && styles.selectedOptionText,
                    ]}
                  >
                    {category.name}
                  </Text>
                  {filters.category === category.id.toString() && (
                    <Ionicons name="checkmark" size={20} color="#2196F3" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Diğer Seçenekler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diğer Seçenekler</Text>
            <View style={styles.switchItem}>
              <Text style={styles.switchLabel}>Sadece Geçerli Kuponlar</Text>
              <Switch
                value={filters.onlyAvailable || false}
                onValueChange={(value) => setFilters({ ...filters, onlyAvailable: value })}
                trackColor={{ false: '#767577', true: '#2196F3' }}
                thumbColor={filters.onlyAvailable ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Filtreleri Uygula</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
