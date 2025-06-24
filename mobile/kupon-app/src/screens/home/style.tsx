import styled from 'styled-components/native';
import { View } from 'react-native';
import { CenteredContainer } from '../../components/styled';

// Styled Components
export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.background};
`;

export const LoadingContainer = styled(CenteredContainer)`
  background-color: ${(props: any) => props.theme.colors.background};
`;

export const SectionContainer = styled(View)`
  margin-bottom: ${(props: any) => props.theme.spacing.lg}px;
`;

export const ItemsContainer = styled(View)<{ numColumns: number }>`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-horizontal: ${(props: any) => props.theme.spacing.sm}px;
`;

export const ItemWrapper = styled(View)<{ width: number }>`
  width: ${(props: any) => props.width}px;
  margin-bottom: ${(props: any) => props.theme.spacing.sm}px;
`;
