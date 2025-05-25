import React, { useMemo, useCallback } from 'react';
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
  padding: ${({ theme }: any) => theme.spacing.sm}px;
  margin-vertical: ${({ theme }: any) => theme.spacing.xs}px;
  margin-horizontal: 0px;
  shadow-color: ${({ theme }: any) => theme.colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
  width: ${({ width, horizontal }: any) => horizontal ? width * 0.42 : (width - 48) / 2}px;
  height: ${({ horizontal }: any) => horizontal ? 140 : 140}px;
  justify-content: space-between;
`;

// Kupon kartları için özel container
const CouponContainer = styled.View<ContainerProps>`
  background-color: #667eea;
  border-radius: ${({ theme }: any) => theme.borders.radius.medium}px;
  padding: ${({ theme }: any) => theme.spacing.sm}px;
  margin-vertical: ${({ theme }: any) => theme.spacing.xs}px;
  margin-horizontal: 0px;
  shadow-color: #764ba2;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 8;
  width: ${({ width, horizontal }: any) => horizontal ? width * 0.42 : (width - 48) / 2}px;
  height: ${({ horizontal }: any) => horizontal ? 160 : 160}px;
  justify-content: space-between;
  border: 2px solid #ffd700;
  position: relative;
  overflow: hidden;
`;

// Kupon kartı için brand logo container
const BrandLogoContainer = styled.View`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }: any) => theme.colors.surface};
  shadow-color: ${({ theme }: any) => theme.colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 3;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const BrandLogo = styled.Image`
  width: 36px;
  height: 36px;
  border-radius: 18px;
`;

// Kampanya başlığı container
const CampaignHeaderContainer = styled.View`
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
  padding-right: 50px;
`;

const CampaignTitle = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  color: #ffffff;
  margin-bottom: ${({ theme }: any) => theme.spacing.xs}px;
  line-height: 20px;
  text-shadow: 0px 1px 2px rgba(0,0,0,0.3);
`;

// Gizlenmiş kupon kodu container
const CouponCodeContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }: any) => theme.borders.radius.small}px;
  padding: ${({ theme }: any) => theme.spacing.xs}px ${({ theme }: any) => theme.spacing.sm}px;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(255, 255, 255, 0.5);
  margin-top: auto;
`;

const HiddenCouponCode = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.small}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.semiBold};
  color: #ffffff;
  letter-spacing: 2px;
  text-shadow: 0px 1px 2px rgba(0,0,0,0.3);
`;

const UnlockHint = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.xs}px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 2px;
  text-align: center;
`;

// Decorative elements - React Native Web için uyumlu
const GradientOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(118, 75, 162, 0.1);
  border-radius: ${({ theme }: any) => theme.borders.radius.medium}px;
`;

const TouchableContainer = styled(TouchableOpacity)<ContainerProps>`
  border-radius: ${({ theme }: any) => theme.borders.radius.medium}px;
  width: ${({ width, horizontal }: any) => horizontal ? width * 0.42 : (width - 48) / 2}px;
`;

const CardImage = styled.Image`
  width: 100%;
  height: 80px;
  border-radius: ${({ theme }: any) => theme.borders.radius.small}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.xs}px;
`;

const PlaceholderImage = styled.View`
  width: 100%;
  height: 80px;
  border-radius: ${({ theme }: any) => theme.borders.radius.small}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.xs}px;
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
  padding-top: ${({ theme }: any) => theme.spacing.xs}px;
  min-height: 40px;
`;

const Title = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  color: ${({ theme }: any) => theme.colors.text};
  margin-bottom: ${({ theme }: any) => theme.spacing.xs}px;
  text-align: center;
  line-height: 20px;
  width: 100%;
`;

const Subtitle = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.small}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
  text-align: center;
  line-height: 16px;
  width: 100%;
  flex: 1;
`;

const CardComponent: React.FC<CardComponentProps> = React.memo(({
  item,
  onPress,
  style,
  horizontal = false, // Default to false for grid layout
}) => {
  const { width } = useWindowDimensions(); // Get window dimensions
  const theme = useTheme();

  // Memoize card properties to avoid recalculation on each render
  const cardProps = useMemo(() => {
    let title = '';
    let subtitle: string | undefined | null = undefined;
    let imageUrl: string | undefined | null = undefined;
    let accessibilityLabelSuffix = '';
    let campaignTitle: string | undefined = undefined;
    let hiddenCode: string | undefined = undefined;

    if (item.type === 'category') {
      title = item.name;
      subtitle = item.description;
      imageUrl = item.image;
      accessibilityLabelSuffix = 'kategorisi';
    } else if (item.type === 'brand') {
      title = item.name;
      subtitle = item.description;
      imageUrl = item.logo;
      accessibilityLabelSuffix = 'markası';
    } else if (item.type === 'coupon') {
      // Kupon kartları için özel logic
      campaignTitle = item.campaign_title || item.description?.split('.')[0] || 'Özel Kampanya';
      hiddenCode = item.code.length > 4 
        ? `${item.code.substring(0, 2)}${'•'.repeat(item.code.length - 4)}${item.code.substring(item.code.length - 2)}`
        : '••••••';
      title = item.brand?.name || 'Kupon';
      imageUrl = item.brand?.logo;
      accessibilityLabelSuffix = 'kuponu';
    }

    return { title, subtitle, imageUrl, accessibilityLabelSuffix, campaignTitle, hiddenCode };
  }, [item]);

  // Memoize image source to avoid recalculation
  const imageSource = useMemo(() => {
    if (!cardProps.imageUrl) return undefined;
    
    let imageUrl = cardProps.imageUrl;
    // API'den gelen resimleri tam URL'e çevir
    const imageApiBaseUrl = API_BASE_URL.replace('localhost', '10.0.2.2');
    if (!imageUrl.startsWith('http')) {
      imageUrl = `${imageApiBaseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
    return { uri: imageUrl };
  }, [cardProps.imageUrl]);

  // Memoize press handler to prevent unnecessary re-renders
  const handlePress = useCallback(() => {
    onPress?.(item);
  }, [onPress, item]);

  return (
    <TouchableContainer
      accessible={true}
      accessibilityLabel={`${cardProps.title}${cardProps.subtitle ? `, ${cardProps.subtitle}` : ''} ${cardProps.accessibilityLabelSuffix}`}
      accessibilityRole="button"
      accessibilityState={{ disabled: !onPress }}
      accessibilityHint={onPress ? `Detayları görmek için dokunun: ${cardProps.title}` : undefined}
      onPress={handlePress}
      style={style}
      disabled={!onPress}
      width={width}
      horizontal={horizontal}
    >
      {item.type === 'coupon' ? (
        // Kupon kartları için özel tasarım
        <CouponContainer width={width} horizontal={horizontal}>
          <GradientOverlay />
          
          {/* Brand Logo */}
          {imageSource && (
            <BrandLogoContainer>
              <BrandLogo
                source={imageSource}
                resizeMode="contain"
                accessible={true}
                accessibilityLabel={`${cardProps.title} markası logosu`}
                accessibilityRole="image"
              />
            </BrandLogoContainer>
          )}

          {/* Kampanya Başlığı */}
          <CampaignHeaderContainer>
            <CampaignTitle numberOfLines={2}>
              {cardProps.campaignTitle}
            </CampaignTitle>
          </CampaignHeaderContainer>

          {/* Gizlenmiş Kupon Kodu */}
          <CouponCodeContainer>
            <HiddenCouponCode>
              {cardProps.hiddenCode}
            </HiddenCouponCode>
            <UnlockHint>
              Kodu görmek için dokun
            </UnlockHint>
          </CouponCodeContainer>
        </CouponContainer>
      ) : (
        // Kategori ve marka kartları için mevcut tasarım
        <Container width={width} horizontal={horizontal}>
          {imageSource ? (
            <CardImage
              source={imageSource}
              resizeMode="contain"
              accessible={true}
              accessibilityLabel={`${cardProps.title} ${item.type === 'brand' ? 'logosu' : 'resmi'}`}
              accessibilityRole="image"
            />
          ) : (
            <PlaceholderImage
              accessible={true}
              accessibilityLabel={`${cardProps.title} için resim yok, baş harf: ${cardProps.title.substring(0, 1).toUpperCase()}`}
              accessibilityRole="image"
            >
              <PlaceholderText>
                {cardProps.title.substring(0, 1).toUpperCase()}
              </PlaceholderText>
            </PlaceholderImage>
          )}
          <ContentContainer>
            <Title numberOfLines={1}>
              {cardProps.title}
            </Title>
            {cardProps.subtitle && (
              <Subtitle numberOfLines={2}>
                {cardProps.subtitle}
              </Subtitle>
            )}
          </ContentContainer>
        </Container>
      )}
    </TouchableContainer>
  );
});

export default CardComponent;