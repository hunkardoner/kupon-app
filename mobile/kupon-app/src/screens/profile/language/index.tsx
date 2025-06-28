import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../../navigation/types';

type LanguageScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Language'>;

interface LanguageScreenProps {
  navigation: LanguageScreenNavigationProp;
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

const LanguageItem = styled.TouchableOpacity<{ selected?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }: any) => theme.spacing.medium}px;
  background-color: ${({ theme, selected }: any) => 
    selected ? theme.colors.primary + '15' : theme.colors.surface};
  border-radius: ${({ theme }: any) => theme.borderRadius.medium}px;
  margin-bottom: ${({ theme }: any) => theme.spacing.small}px;
  border: 2px solid ${({ theme, selected }: any) => 
    selected ? theme.colors.primary : 'transparent'};
`;

const LanguageContent = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const LanguageFlag = styled.Text`
  font-size: 24px;
  margin-right: ${({ theme }: any) => theme.spacing.medium}px;
`;

const LanguageDetails = styled.View`
  flex: 1;
`;

const LanguageName = styled.Text<{ selected?: boolean }>`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.medium};
  color: ${({ theme, selected }: any) => 
    selected ? theme.colors.primary : theme.colors.text};
  margin-bottom: 2px;
`;

const LanguageNativeName = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.small}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
`;

const languages = [
  { code: 'tr', name: 'Türkçe', nativeName: 'Turkish', flag: '🇹🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', nativeName: 'German', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', nativeName: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Español', nativeName: 'Spanish', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', nativeName: 'Arabic', flag: '🇸🇦' },
];

export function LanguageScreen({ navigation }: LanguageScreenProps) {
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('tr');

  const selectLanguage = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    // Here you would typically update the app's language
    // For now, we'll just update the state
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
        <HeaderTitle>Dil Seçimi</HeaderTitle>
      </Header>

      <Content>
        {languages.map(language => (
          <LanguageItem
            key={language.code}
            selected={selectedLanguage === language.code}
            onPress={() => selectLanguage(language.code)}
          >
            <LanguageContent>
              <LanguageFlag>{language.flag}</LanguageFlag>
              <LanguageDetails>
                <LanguageName selected={selectedLanguage === language.code}>
                  {language.name}
                </LanguageName>
                <LanguageNativeName>{language.nativeName}</LanguageNativeName>
              </LanguageDetails>
            </LanguageContent>
            {selectedLanguage === language.code && (
              <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
            )}
          </LanguageItem>
        ))}
      </Content>
    </Container>
  );
}

export default LanguageScreen;
