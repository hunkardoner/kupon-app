# Styled-Components Migration Rehberi

Bu rehber, React Native projesindeki `StyleSheet.create` kullanımını **styled-components** ile değiştirme sürecini anlatır.

## ✅ Tamamlanan İşlemler

1. **Styled-components kurulumu yapıldı**
2. **Tema sistemi oluşturuldu** (`src/theme/`)
3. **Temel styled components kütüphanesi oluşturuldu** (`src/components/styled/`)
4. **ThemeProvider App.tsx'e eklendi**
5. **BrandListScreen styled-components'e geçirildi** (örnek)

## 🔄 Geçiş Adımları (Diğer Ekranlar İçin)

### Adım 1: Eski Stil Dosyalarını Tespit Et

Geçirilmesi gereken dosyalar:
- `src/screens/HomeScreen.styles.ts`
- `src/screens/CouponListScreen.styles.ts`
- `src/screens/CategoryListScreen.styles.ts`
- Diğer `.styles.ts` dosyaları

### Adım 2: Screen Dosyasını Güncellemek

**Eski Yaklaşım:**
```tsx
import createStyles from './ScreenName.styles';
import COLORS from '../constants/colors';

const { styles } = createStyles(width);

<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
</View>
```

**Yeni Yaklaşım:**
```tsx
import styled from 'styled-components/native';
import { useTheme } from '../theme';

const Container = styled.View\`
  flex: 1;
  background-color: \${(props: any) => props.theme.colors.background};
\`;

const Title = styled.Text\`
  font-size: \${(props: any) => props.theme.typography.sizes.xl}px;
  color: \${(props: any) => props.theme.colors.text};
\`;

const { theme } = useTheme();

<Container>
  <Title>Title</Title>
</Container>
```

### Adım 3: Hazır Styled Components Kullanımı

`src/components/styled/index.ts` dosyasından hazır componentleri kullanabilirsiniz:

```tsx
import { 
  Container, 
  CenteredContainer, 
  Title, 
  Text, 
  Card,
  Row,
  Column,
  Spacer 
} from '../components/styled';

// Kullanım
<Container>
  <Title size="xl" weight="bold">Başlık</Title>
  <Card>
    <Row gap="sm">
      <Text>Metin</Text>
    </Row>
  </Card>
  <Spacer size="lg" />
</Container>
```

## 🎨 Tema Kullanımı

### Dark Mode Desteği
```tsx
const { theme, isDark } = useTheme();

// Otomatik olarak sistem temasını takip eder
// Manuel olarak dark mode zorlamak için:
<ThemeProvider forceDarkMode={true}>
  <App />
</ThemeProvider>
```

### Tema Değerleri
```tsx
// Renkler
theme.colors.primary
theme.colors.background
theme.colors.text

// Spacing
theme.spacing.xs  // 4px
theme.spacing.sm  // 8px
theme.spacing.md  // 16px
theme.spacing.lg  // 24px

// Typography
theme.typography.sizes.sm   // 14px
theme.typography.sizes.md   // 16px
theme.typography.sizes.lg   // 18px

// Borders
theme.borders.radius.sm    // 4px
theme.borders.radius.md    // 8px
```

## 📋 TODO Liste (Sıradaki Ekranlar)

- [ ] `HomeScreen.tsx` - styled-components'e geçir
- [ ] `CouponListScreen.tsx` - styled-components'e geçir  
- [ ] `CategoryListScreen.tsx` - styled-components'e geçir
- [ ] `CouponScreen.tsx` - styled-components'e geçir
- [ ] `BrandScreen.tsx` - styled-components'e geçir
- [ ] `CategoryScreen.tsx` - styled-components'e geçir
- [ ] `CardComponent.tsx` - styled-components'e geçir

## 🚀 Faydalar

1. **Tutarlı Tasarım**: Merkezi tema sistemi
2. **Dark Mode**: Otomatik tema desteği
3. **TypeScript**: Tam tip güvenliği
4. **Responsive**: useWindowDimensions ile otomatik uyum
5. **Bakım**: Tek yerden stil yönetimi
6. **Performance**: Styled-components optimizasyonları

## 📝 Best Practices

1. **Styled componentleri dosya içinde tanımlayın** (küçük ekranlar için)
2. **Büyük projelerde ortak styled componentleri `/src/components/styled/` klasöründe tutun**
3. **Theme değerlerini doğrudan kullanın** (hardcode değerler yerine)
4. **Props ile dinamik styling yapın**
5. **useTheme hook'unu kullanarak tema erişimi sağlayın**

## 🔧 Troubleshooting

**TypeScript Hataları:**
- `(props: any)` kullanın veya proper typing yapın
- `AppTheme` tipini import edin

**Performance:**
- Styled componentleri component dışında tanımlayın
- Memoization kullanın gerekirse

**Theme Erişimi:**
- ThemeProvider'ın component tree'de doğru yerde olduğundan emin olun
