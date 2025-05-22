import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors'; // Sab

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sectionContainer: {
    marginBottom: 20, // Alt boşluk artırıldı
    paddingHorizontal: 16, // Increased and equalized horizontal padding
    paddingTop: 8, // Add top padding for better spacing between sections
  },
  horizontalList: {
    paddingLeft: 16, // Start with full padding
    paddingRight: 16, // End with full padding
    gap: 16, // Add spacing between items
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
