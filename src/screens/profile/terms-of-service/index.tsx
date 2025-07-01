import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../../navigation/types';

type TermsOfServiceScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'TermsOfService'>;

interface TermsOfServiceScreenProps {
  navigation: TermsOfServiceScreenNavigationProp;
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

const Paragraph = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  color: ${({ theme }: any) => theme.colors.text};
  line-height: 24px;
  margin-bottom: ${({ theme }: any) => theme.spacing.medium}px;
`;

const ListItem = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.medium}px;
  color: ${({ theme }: any) => theme.colors.text};
  line-height: 24px;
  margin-bottom: ${({ theme }: any) => theme.spacing.small}px;
  margin-left: ${({ theme }: any) => theme.spacing.medium}px;
`;

const LastUpdated = styled.Text`
  font-size: ${({ theme }: any) => theme.typography.sizes.small}px;
  color: ${({ theme }: any) => theme.colors.textSecondary};
  font-style: italic;
  margin-bottom: ${({ theme }: any) => theme.spacing.large}px;
`;

export function TermsOfServiceScreen({ navigation }: TermsOfServiceScreenProps) {
  const { theme } = useTheme();

  return (
    <Container>
      <Header>
        <Ionicons 
          name="chevron-back" 
          size={24} 
          color={theme.colors.text} 
          onPress={() => navigation.goBack()}
        />
        <HeaderTitle>Kullanım Koşulları</HeaderTitle>
      </Header>

      <Content>
        <LastUpdated>Son güncelleme: 1 Ocak 2024</LastUpdated>

        <Section>
          <SectionTitle>1. Kabul ve Onay</SectionTitle>
          <Paragraph>
            Bu Kullanım Koşulları ("Koşullar"), Kupon Uygulaması ("Uygulama") 
            kullanımınızı düzenler. Uygulamayı kullanarak, bu Koşulları kabul 
            etmiş sayılırsınız.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>2. Hizmet Tanımı</SectionTitle>
          <Paragraph>
            Uygulamamız, çeşitli mağaza ve markalardan kupon ve indirim tekliflerini 
            toplayan ve kullanıcılara sunan bir platformdur.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>3. Kullanıcı Sorumlulukları</SectionTitle>
          <Paragraph>Kullanıcı olarak aşağıdakileri kabul edersiniz:</Paragraph>
          <ListItem>• Doğru ve güncel bilgiler sağlayacaksınız</ListItem>
          <ListItem>• Hesap güvenliğinizi koruyacaksınız</ListItem>
          <ListItem>• Uygulamayı yasal amaçlarla kullanacaksınız</ListItem>
          <ListItem>• Diğer kullanıcıların haklarına saygı göstereceksiniz</ListItem>
        </Section>

        <Section>
          <SectionTitle>4. Kupon Kullanımı</SectionTitle>
          <Paragraph>
            Kuponların kullanımı, ilgili mağaza veya markanın kendi koşullarına 
            tabidir. Her kuponun kendine özgü kullanım koşulları ve geçerlilik 
            süresi bulunmaktadır.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>5. Fikri Mülkiyet</SectionTitle>
          <Paragraph>
            Uygulamadaki tüm içerik, tasarım ve yazılım telif hakkı ile korunmaktadır. 
            İzinsiz kopyalama, dağıtım veya ticari kullanım yasaktır.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>6. Sorumluluk Reddi</SectionTitle>
          <Paragraph>
            Kuponların geçerliliği, mağaza stokları veya üçüncü parti hizmetlerle 
            ilgili sorunlardan sorumlu değiliz. Uygulama "olduğu gibi" sunulmaktadır.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>7. Hesap Sonlandırma</SectionTitle>
          <Paragraph>
            Bu Koşulları ihlal etmeniz durumunda hesabınızı sonlandırma hakkımızı 
            saklı tutarız. Siz de istediğiniz zaman hesabınızı kapatabilirsiniz.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>8. Değişiklikler</SectionTitle>
          <Paragraph>
            Bu Koşulları önceden bildirimde bulunarak değiştirme hakkımızı saklı 
            tutarız. Değişiklikler uygulamada yayınlandığı tarihte yürürlüğe girer.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>9. İletişim</SectionTitle>
          <Paragraph>
            Bu Koşullarla ilgili sorularınız için bizimle iletişime geçebilirsiniz:
          </Paragraph>
          <ListItem>• Email: destek@kuponcepte.com.tr</ListItem>
          <ListItem>• Telefon: +90 (212) 555-0000</ListItem>
        </Section>
      </Content>
    </Container>
  );
}

export default TermsOfServiceScreen;
