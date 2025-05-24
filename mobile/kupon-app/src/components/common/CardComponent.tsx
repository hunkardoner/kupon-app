import React from 'react';
import {
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import styled from 'styled-components/native';
import { Category, Brand, Coupon } from '../../types';
import { useTheme } from '../../theme';

// API için temel URL - güncellenebilir
const API_BASE_URL = 'http://localhost:8000';

// CardComponent'in alabileceği item tiplerini birleştir
export type CardItem =
  | (Category & { type: 'category' })
  | (Brand & { type: 'brand' })
  | (Coupon & { type: 'coupon' });

interface CardComponentProps {
  item: CardItem;
  onPress?: (item: CardItem) => void;
  style?: object;
  horizontal?: boolean; // Add prop to indicate if card is in a horizontal list
}

// Styled Components
interface ContainerProps {
  width: number;
  horizontal?: boolean;
}

const Container = styled.View<ContainerProps>`
  background-color: ${({ theme }: any) => theme.colors.card};
  border-radius: ${({ theme }: any) => theme.borders.radius.medium}px;
  padding: ${({ theme }: any) => theme.spacing.medium}px;
  margin-vertical: ${({ theme }: any) => theme.spacing.xs}px;
  margin-horizontal: 0px;
  shadow-color: ${({ theme }: any) => theme.colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
  width: ${({ width, horizontal }: any) => horizontal ? width * 0.42 : (width - 48) / 2}px;
  height: ${({ horizontal }: any) => horizontal ? 200 : 200}px;
`;

const TouchableContainer = styled(TouchableOpacity)<ContainerProps>`
  border-radius: ${({ theme }: any) => theme.borders.radius.medium}px;
  width: ${({ width, horizontal }: any) => horizontal ? width * 0.42 : (width - 48) / 2}px;
`;

const CardImage = styled.Image`
  width: 100%;
  height: 120px;
  border-radius: ${({ theme }: any) => theme.borders.radius.small}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.medium}px;
`;

const PlaceholderImage = styled.View`
  width: 100%;
  height: 120px;
  border-radius: ${({ theme }: any) => theme.borders.radius.small}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.medium}px;
  background-color: ${({ theme }: any) => theme.colors.secondary};
  justify-content: center;
  align-items: center;
`;

const PlaceholderText = styled.Text`
  color: ${({ theme }: any) => theme.colors.surface};
  font-size: ${({ theme }: any) => theme.typography.sizes.xxxl}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
`;

const ContentContainer = styled.View`
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const Title = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  color: ${({ theme }: any) => theme.colors.text};
  margin-bottom: ${({ theme }: any) => theme.spacing.xs}px;
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.small}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
  text-align: center;
  max-height: 32px;
`;

const CardComponent: React.FC<CardComponentProps> = ({
  item,
  onPress,
  style,
  horizontal = false, // Default to false for grid layout
}) => {
  const { width } = useWindowDimensions(); // Get window dimensions
  const theme = useTheme();

  let title = '';
  let subtitle: string | undefined | null = undefined;
  let imageUrl: string | undefined | null = undefined;
  let accessibilityLabelSuffix = '';

  if (item.type === 'category') {
    title = item.name;
    subtitle = item.description;
    imageUrl = item.image; // Changed from item.image_url to item.image
    accessibilityLabelSuffix = 'kategorisi';
  } else if (item.type === 'brand') {
    title = item.name;
    subtitle = item.description;
    imageUrl = item.logo; // Changed from logo_url to logo
    accessibilityLabelSuffix = 'markası';
  } else if (item.type === 'coupon') {
    title = item.code; // Changed from title to code
    subtitle = item.description;
    imageUrl = item.brand?.logo; // Use brand logo for coupon
    accessibilityLabelSuffix = 'kuponu';
  }

  // Image source handling
  let imageSource: { uri: string } | undefined = undefined;
  if (imageUrl) {
    // API'den gelen resimleri tam URL'e çevir
    const imageApiBaseUrl = API_BASE_URL.replace('localhost', '10.0.2.2');
    if (!imageUrl.startsWith('http')) {
      imageUrl = `${imageApiBaseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
    imageSource = { uri: imageUrl };
  }

  return (
    <TouchableContainer
      accessible={true}
      accessibilityLabel={`${title}${subtitle ? `, ${subtitle}` : ''} ${accessibilityLabelSuffix}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: !onPress }}
      accessibilityHint={onPress ? `Detayları görmek için dokunun: ${title}` : undefined}
      onPress={() => onPress && onPress(item)}
      style={style}
      disabled={!onPress}
      width={width}
      horizontal={horizontal}
    >
      <Container width={width} horizontal={horizontal}>
        {imageSource ? (
          <CardImage
            source={imageSource}
            resizeMode="contain"
            accessible={true}
            accessibilityLabel={`${title} ${item.type === 'brand' || (item.type === 'coupon' && item.brand) ? 'logosu' : 'resmi'}`}
            accessibilityRole="image"
          />
        ) : (
          <PlaceholderImage
            accessible={true}
            accessibilityLabel={`${title} için resim yok, baş harf: ${title.substring(0, 1).toUpperCase()}`}
            accessibilityRole="image"
          >
            <PlaceholderText>
              {title.substring(0, 1).toUpperCase()}
            </PlaceholderText>
          </PlaceholderImage>
        )}
        <ContentContainer>
          <Title numberOfLines={1}>
            {title}
          </Title>
          {subtitle && (
            <Subtitle numberOfLines={2}>
              {subtitle}
            </Subtitle>
          )}
        </ContentContainer>
      </Container>
    </TouchableContainer>
  );
};

export default CardComponent;