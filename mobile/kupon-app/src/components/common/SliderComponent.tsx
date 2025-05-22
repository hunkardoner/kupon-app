import React from 'react';
import { View, Text, Image, FlatList, Dimensions, TouchableOpacity, Platform } from 'react-native'; // Import Platform
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
    let imageUrl = item.image; // This is 'http://localhost:8000/storage/...'

    // If on Android and the URL is pointing to host's localhost (localhost),
    // replace localhost with 10.0.2.2 for the Android emulator to reach the host.
    if (Platform.OS === 'android' && imageUrl && imageUrl.includes('localhost')) {
      imageUrl = imageUrl.replace('localhost', '10.0.2.2');
    }

    // The existing logic for relative paths (from your original code) will be skipped
    // if 'imageUrl' is already an absolute URL (which it is after the potential Android IP fix).
    // const imageBaseUrl = API_BASE_URL.replace('/api', '');
    // if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    //   imageUrl = `${imageBaseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    // }

    return (
      <TouchableOpacity
        onPress={() => onPressSlider && onPressSlider(item)}
        style={[styles.slide, { width }]} // Her slide tam ekran genişliği
      >
        {imageUrl && (
          <Image 
            source={{ uri: imageUrl }} 
            style={styles.image} // Use stylesheet style, remove inline
            resizeMode="cover" 
          />
        )}
        {/* <View style={styles.textContainer}> */}
          {/* {item.title && <Text style={styles.title}>{item.title}</Text>} */}
          {/* item.description is not in SliderResource.php, so commenting out */}
          {/* {item.description && <Text style={styles.description}>{item.description}</Text>} */}
        {/* </View> */}
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
