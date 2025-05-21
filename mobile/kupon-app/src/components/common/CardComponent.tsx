import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import styles from './CardComponent.styles';

interface CardComponentProps {
  title: string;
  subtitle?: string;
  imageUrl?: string; // For remote images
  localImageSource?: ImageSourcePropType; // For local images
  onPress?: () => void;
  style?: object; // Allow passing custom styles
}

const CardComponent: React.FC<CardComponentProps> = ({
  title,
  subtitle,
  imageUrl,
  localImageSource,
  onPress,
  style,
}) => {
  const imageSource = localImageSource || (imageUrl ? { uri: imageUrl } : undefined);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.touchable, style]} disabled={!onPress}>
      <View style={styles.container}>
        {imageSource && (
          <Image source={imageSource} style={styles.image} />
        )}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CardComponent;
