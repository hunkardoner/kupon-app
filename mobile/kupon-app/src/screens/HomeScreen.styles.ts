import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors'; // Sab

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sectionContainer: {
    marginBottom: 20, // Alt boşluk artırıldı
    paddingHorizontal: 8, // Bölüm için yatay padding
  },
  horizontalList: {
    paddingLeft: 8, // İlk eleman için sol padding
    paddingRight: 8, // Son eleman için sağ padding
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16, // İçerik için padding
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    textAlign: 'center',
  },
  // Diğer stiller component bazlı dosyalarda (CardComponent.styles.ts, SectionHeaderComponent.styles.ts)
});

export default styles;
