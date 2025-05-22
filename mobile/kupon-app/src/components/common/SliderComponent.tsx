import React from 'react';
import { View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import styles from './SliderComponent.styles'; // Assuming .styles.ts is in the same directory
import { Slider } from '../../types'; // Slider tipini import et

interface SliderComponentProps {
  sliders: Slider[];
  onPressSlider?: (slider: Slider) => void;
}

const { width } = Dimensions.get('window');

const SliderComponent: React.FC<SliderComponentProps> = ({ sliders, onPressSlider }) => {
  if (!sliders || sliders.length === 0) {
    return null; // Eğer slider yoksa hiçbir şey gösterme
  }

  const renderItem = ({ item }: { item: Slider }) => (
    <TouchableOpacity onPress={() => onPressSlider && onPressSlider(item)} style={styles.slide}>
      {item.image_url && (
        <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" />
      )}
      <View style={styles.textContainer}>
        {item.title && <Text style={styles.title}>{item.title}</Text>}
        {item.description && <Text style={styles.description}>{item.description}</Text>}
      </View>
    </TouchableOpacity>
  );

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
