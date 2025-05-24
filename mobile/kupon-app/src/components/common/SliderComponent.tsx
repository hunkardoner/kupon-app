import React from 'react';
import {
  FlatList,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import styled from 'styled-components/native';
import { Slider } from '../../types';
import { API_BASE_URL } from '../../api/index';

interface SliderComponentProps {
  sliders: Slider[];
  onPressSlider?: (slider: Slider) => void;
  onPress?: (slider: Slider) => void; // Add backward compatibility
}

// Styled Components
const Container = styled.View`
  height: 200px;
  margin-bottom: ${({ theme }: any) => theme.spacing.medium}px;
`;

const SliderList = styled(FlatList)`
  height: 100%;
`;

const Slide = styled(TouchableOpacity)<{ width: number }>`
  width: ${({ width }: any) => width}px;
  height: 250px;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const SliderImage = styled.Image`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const TextContainer = styled.View`
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: ${({ theme }: any) => theme.spacing.small}px;
  border-radius: ${({ theme }: any) => theme.borders.radius.small}px;
`;

const Title = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.large}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  color: ${({ theme }: any) => theme.colors.surface};
  text-align: center;
`;

const Description = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  color: ${({ theme }: any) => theme.colors.surface};
  text-align: center;
  margin-top: ${({ theme }: any) => theme.spacing.xs}px;
`;

const SliderComponent: React.FC<SliderComponentProps> = ({
  sliders,
  onPressSlider,
  onPress, // Add the new prop
}) => {
  const { width } = useWindowDimensions();

  if (!sliders || sliders.length === 0) {
    return null;
  }

  // Use onPress or onPressSlider, preferring onPress for backward compatibility
  const handlePress = onPress || onPressSlider;

  const renderItem = ({ item }: { item: Slider }) => {
    let imageUrl = item.image;

    if (
      Platform.OS === 'android' &&
      imageUrl &&
      imageUrl.includes('localhost')
    ) {
      imageUrl = imageUrl.replace('localhost', '10.0.2.2');
    }

    return (
      <Slide
        width={width}
        onPress={() => handlePress && handlePress(item)}
      >
        {imageUrl && (
          <SliderImage
            source={{ uri: imageUrl }}
            resizeMode="cover"
          />
        )}
        {/* Text container could be added here if needed for title/description */}
      </Slide>
    );
  };

  return (
    <Container>
      <SliderList
        data={sliders}
        renderItem={renderItem}
        keyExtractor={(item: Slider) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      />
    </Container>
  );
};

export default SliderComponent;
