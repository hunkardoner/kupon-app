import React from 'react';
import { View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import styles from './SliderComponent.styles';
import { Slider } from '../../types';
import { API_BASE_URL } from '../../api/index'; // Import API_BASE_URL from api/index.ts

interface SliderComponentProps {
  sliders: Slider[];
  onPressSlider?: (slider: Slider) => void;
}

const { width } = Dimensions.get('window');

const SliderComponent: React.FC<SliderComponentProps> = ({ sliders, onPressSlider }) => {
  if (!sliders || sliders.length === 0) {
    return null; // Eğer slider yoksa hiçbir şey gösterme
  }

  const renderItem = ({ item }: { item: Slider }) => {
    let imageUrl = item.image;

    // Resim URL'sini işle - remove '/api' from API_BASE_URL for storage paths
    const imageBaseUrl = API_BASE_URL.replace('/api', '');
    if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      imageUrl = `${imageBaseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }

    return (
      <TouchableOpacity
        onPress={() => onPressSlider && onPressSlider(item)}
        style={[styles.slide, { width }]} // Her slide tam ekran genişliği
      >
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        )}
        <View style={styles.textContainer}>
          {item.title && <Text style={styles.title}>{item.title}</Text>}
          {item.description && <Text style={styles.description}>{item.description}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sliders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.sliderList}
      />
    </View>
  );
};

export default SliderComponent;
