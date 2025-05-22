import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Platform, useWindowDimensions } from 'react-native'; // Import useWindowDimensions
import createStyles from './SliderComponent.styles'; // Import createStyles
import { Slider } from '../../types';
import { API_BASE_URL } from '../../api/index';

interface SliderComponentProps {
  sliders: Slider[];
  onPressSlider?: (slider: Slider) => void;
}

const SliderComponent: React.FC<SliderComponentProps> = ({ sliders, onPressSlider }) => {
  const { width } = useWindowDimensions(); // useWindowDimensions hook'unu kullan
  const styles = createStyles(width); // Stilleri dinamik olarak oluştur

  if (!sliders || sliders.length === 0) {
    return null;
  }

  const renderItem = ({ item }: { item: Slider }) => {
    let imageUrl = item.image;

    if (Platform.OS === 'android' && imageUrl && imageUrl.includes('localhost')) {
      imageUrl = imageUrl.replace('localhost', '10.0.2.2');
    }

    return (
      <TouchableOpacity
        onPress={() => onPressSlider && onPressSlider(item)}
        style={styles.slide} // Dinamik genişlik stil dosyasından gelecek, { width } kaldırıldı
      >
        {imageUrl && (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image}
            resizeMode="cover" 
          />
        )}
        {/* Text container yorumları kaldırılabilir veya isteğe bağlı olarak eklenebilir */}
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
