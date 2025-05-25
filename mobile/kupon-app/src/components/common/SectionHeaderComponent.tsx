import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface SectionHeaderProps {
  title: string;
  onSeeAllPress?: () => void; // "Tümünü Gör" butonu için opsiyonel fonksiyon
  seeAllText?: string;
}

// Styled Components
const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: ${({ theme }: any) => theme.spacing.medium}px;
  padding-vertical: ${({ theme }: any) => theme.spacing.medium}px;
`;

const Title = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.large}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  color: ${({ theme }: any) => theme.colors.text};
`;

const SeeAllButton = styled(TouchableOpacity)``;

const SeeAllText = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.semiBold};
  color: ${({ theme }: any) => theme.colors.primary};
`;

const SectionHeaderComponent: React.FC<SectionHeaderProps> = React.memo(({
  title,
  onSeeAllPress, // onViewMore -> onSeeAllPress olarak düzeltildi
  seeAllText = 'Tümünü Gör',
}) => {
  const handlePress = useCallback(() => {
    onSeeAllPress?.();
  }, [onSeeAllPress]);

  return (
    <Container>
      <Title>{title}</Title>
      {onSeeAllPress && (
        <SeeAllButton onPress={handlePress}>
          <SeeAllText>{seeAllText}</SeeAllText>
        </SeeAllButton>
      )}
    </Container>
  );
});

// Display name for better debugging
SectionHeaderComponent.displayName = 'SectionHeaderComponent';

export default SectionHeaderComponent;
