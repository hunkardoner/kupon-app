import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../../navigation/types';

type CurrencyScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Currency'>;

interface CurrencyScreenProps {
  navigation: CurrencyScreenNavigationProp;
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

const CurrencyItem = styled.TouchableOpacity<{ selected?: boolean }>`
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

const CurrencyContent = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const CurrencySymbol = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-right: ${({ theme }: any) => theme.spacing.medium}px;
  width: 30px;
  text-align: center;
`;

const CurrencyDetails = styled.View`
  flex: 1;
`;

const CurrencyName = styled.Text<{ selected?: boolean }>`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  font-weight: ${({ theme }: any) => theme.typography.weights.medium};
  color: ${({ theme, selected }: any) => 
    selected ? theme.colors.primary : theme.colors.text};
  margin-bottom: 2px;
`;

const CurrencyCode = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.small}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
`;

const currencies = [
  { code: 'TRY', name: 'Türk Lirası', symbol: '₺' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
];

export function CurrencyScreen({ navigation }: CurrencyScreenProps) {
  const { theme } = useTheme();
  const [selectedCurrency, setSelectedCurrency] = useState('TRY');

  const selectCurrency = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    // Here you would typically update the app's currency preference
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
        <HeaderTitle>Para Birimi</HeaderTitle>
      </Header>

      <Content>
        {currencies.map(currency => (
          <CurrencyItem
            key={currency.code}
            selected={selectedCurrency === currency.code}
            onPress={() => selectCurrency(currency.code)}
          >
            <CurrencyContent>
              <CurrencySymbol>{currency.symbol}</CurrencySymbol>
              <CurrencyDetails>
                <CurrencyName selected={selectedCurrency === currency.code}>
                  {currency.name}
                </CurrencyName>
                <CurrencyCode>{currency.code}</CurrencyCode>
              </CurrencyDetails>
            </CurrencyContent>
            {selectedCurrency === currency.code && (
              <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
            )}
          </CurrencyItem>
        ))}
      </Content>
    </Container>
  );
}

export default CurrencyScreen;
