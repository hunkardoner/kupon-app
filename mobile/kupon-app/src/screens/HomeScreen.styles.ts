import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  listContentContainer: {
    paddingHorizontal: 8, // Kenarlardan boşluk
  },
  categoryItem: {
    flex: 1,
    margin: 8,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // Gölge efekti (iOS)
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Gölge efekti (Android)
    elevation: 3,
    minHeight: 100, // Kartların minimum yüksekliği
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

export default styles;
