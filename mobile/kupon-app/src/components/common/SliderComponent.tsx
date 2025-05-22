import React from 'react';
import { View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import styles from './SliderComponent.styles'; // Assuming .styles.ts is in the same directory
import { Slider } from '../../types'; // Slider tipini import et

// API için temel URL - güncellenebilir
const API_BASE_URL = 'http://localhost:8000';

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
    let imageUrl = item.image_url;

    // Resim URL'sini işle
    if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      imageUrl = `${API_BASE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
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
