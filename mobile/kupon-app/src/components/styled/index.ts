// src/components/styled/index.ts
import styled from 'styled-components/native';
import { Text as RNText, View as RNView, ScrollView as RNScrollView } from 'react-native';
import { AppTheme } from '../../theme/theme';

// Basic styled components
export const Container = styled(RNView)`
  flex: 1;
  background-color: ${(props: { theme: AppTheme }) => props.theme.colors.background};
`;

export const Card = styled(RNView)`
  background-color: ${(props: { theme: AppTheme }) => props.theme.colors.card};
  border-radius: ${(props: { theme: AppTheme }) => props.theme.borders.radius.md}px;
  padding: ${(props: { theme: AppTheme }) => props.theme.spacing.md}px;
  margin: ${(props: { theme: AppTheme }) => props.theme.spacing.sm}px;
  border-width: ${(props: { theme: AppTheme }) => props.theme.borders.width.thin}px;
  border-color: ${(props: { theme: AppTheme }) => props.theme.colors.border};
`;

export const Row = styled(RNView)<{ gap?: keyof AppTheme['spacing'] }>`
  flex-direction: row;
  align-items: center;
  gap: ${(props: { theme: AppTheme; gap?: keyof AppTheme['spacing'] }) => 
    props.theme.spacing[props.gap || 'md']}px;
`;

export const Column = styled(RNView)<{ gap?: keyof AppTheme['spacing'] }>`
  flex-direction: column;
  gap: ${(props: { theme: AppTheme; gap?: keyof AppTheme['spacing'] }) => 
    props.theme.spacing[props.gap || 'md']}px;
`;

// Typography components
export const Title = styled(RNText)<{ 
  size?: keyof AppTheme['typography']['sizes'];
  weight?: keyof AppTheme['typography']['weights'];
  color?: string;
}>`
  font-size: ${(props: { theme: AppTheme; size?: keyof AppTheme['typography']['sizes'] }) => 
    props.theme.typography.sizes[props.size || 'xl']}px;
  font-weight: ${(props: { theme: AppTheme; weight?: keyof AppTheme['typography']['weights'] }) => 
    props.theme.typography.weights[props.weight || 'bold']};
  color: ${(props: { theme: AppTheme; color?: string }) => 
    props.color || props.theme.colors.text};
`;

export const Text = styled(RNText)<{
  size?: keyof AppTheme['typography']['sizes'];
  weight?: keyof AppTheme['typography']['weights'];
  color?: string;
}>`
  font-size: ${(props: { theme: AppTheme; size?: keyof AppTheme['typography']['sizes'] }) => 
    props.theme.typography.sizes[props.size || 'md']}px;
  font-weight: ${(props: { theme: AppTheme; weight?: keyof AppTheme['typography']['weights'] }) => 
    props.theme.typography.weights[props.weight || 'normal']};
  color: ${(props: { theme: AppTheme; color?: string }) => 
    props.color || props.theme.colors.text};
`;

export const SecondaryText = styled(Text)`
  color: ${(props: { theme: AppTheme }) => props.theme.colors.textSecondary};
`;

// Layout components
export const CenteredContainer = styled(Container)`
  justify-content: center;
  align-items: center;
  padding: ${(props: { theme: AppTheme }) => props.theme.spacing.lg}px;
`;

export const SafeContainer = styled(Container)`
  padding-top: ${(props: { theme: AppTheme }) => props.theme.spacing.lg}px;
`;

export const ScrollContainer = styled(RNScrollView)`
  flex: 1;
  background-color: ${(props: { theme: AppTheme }) => props.theme.colors.background};
`;

// Spacing components
export const Spacer = styled(RNView)<{ size?: keyof AppTheme['spacing'] }>`
  height: ${(props: { theme: AppTheme; size?: keyof AppTheme['spacing'] }) => 
    props.theme.spacing[props.size || 'md']}px;
`;

export const HSpacer = styled(RNView)<{ size?: keyof AppTheme['spacing'] }>`
  width: ${(props: { theme: AppTheme; size?: keyof AppTheme['spacing'] }) => 
    props.theme.spacing[props.size || 'md']}px;
`;
