import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../../navigation/types';

type PreferencesScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Preferences'>;

interface PreferencesScreenProps {
  navigation: PreferencesScreenNavigationProp;
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }: any) => theme.colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }: any) => theme.spacing.large}px;
  background-color: ${({ theme }: any) => theme.colors.surface};
`;

const HeaderTitle = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.xl}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  color: ${({ theme }: any) => theme.colors.text};
  margin-left: ${({ theme }: any) => theme.spacing.medium}px;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: ${({ theme }: any) => theme.spacing.large}px;
`;

const Section = styled.View`
  margin-bottom: ${({ theme }: any) => theme.spacing.large}px;
`;

const SectionTitle = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.large}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.bold};
  color: ${({ theme }: any) => theme.colors.text};
  margin-bottom: ${({ theme }: any) => theme.spacing.medium}px;
`;

const CategoryItem = styled.TouchableOpacity<{ selected?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }: any) => theme.spacing.medium}px;
  background-color: ${({ theme, selected }: any) => 
    selected ? theme.colors.primary + '15' : theme.colors.surface};
  border-radius: ${({ theme }: any) => theme.borderRadius.medium}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.small}px;
  border: 2px solid ${({ theme, selected }: any) => 
    selected ? theme.colors.primary : 'transparent'};
`;

const CategoryIcon = styled.View<{ selected?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${({ theme, selected }: any) => 
    selected ? theme.colors.primary : theme.colors.primary + '15'};
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }: any) => theme.spacing.medium}px;
`;

const CategoryText = styled.Text<{ selected?: boolean }>`
  flex: 1;
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.medium};
  color: ${({ theme, selected }: any) => 
    selected ? theme.colors.primary : theme.colors.text};
`;

const categories = [
  { id: 1, name: 'Teknoloji', icon: 'phone-portrait-outline' },
  { id: 2, name: 'Moda', icon: 'shirt-outline' },
  { id: 3, name: 'Yiyecek & İçecek', icon: 'restaurant-outline' },
  { id: 4, name: 'Seyahat', icon: 'airplane-outline' },
  { id: 5, name: 'Sağlık & Güzellik', icon: 'heart-outline' },
  { id: 6, name: 'Spor', icon: 'fitness-outline' },
  { id: 7, name: 'Ev & Bahçe', icon: 'home-outline' },
  { id: 8, name: 'Kitap & Müzik', icon: 'book-outline' },
];

export function PreferencesScreen({ navigation }: PreferencesScreenProps) {
  const { theme } = useTheme();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([1, 2, 3]);

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <Container>
      <Header>
        <Ionicons 
          name="chevron-back" 
          size={24} 
          color={theme.colors.text} 
          onPress={() => navigation.goBack()}
        />
        <HeaderTitle>Tercihlerim</HeaderTitle>
      </Header>

      <Content>
        <Section>
          <SectionTitle>İlgi Alanlarınız</SectionTitle>
          {categories.map(category => (
            <CategoryItem
              key={category.id}
              selected={selectedCategories.includes(category.id)}
              onPress={() => toggleCategory(category.id)}
            >
              <CategoryIcon selected={selectedCategories.includes(category.id)}>
                <Ionicons 
                  name={category.icon as any} 
                  size={16} 
                  color={selectedCategories.includes(category.id) ? 'white' : theme.colors.primary} 
                />
              </CategoryIcon>
              <CategoryText selected={selectedCategories.includes(category.id)}>
                {category.name}
              </CategoryText>
              {selectedCategories.includes(category.id) && (
                <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
              )}
            </CategoryItem>
          ))}
        </Section>
      </Content>
    </Container>
  );
}

export default PreferencesScreen;
