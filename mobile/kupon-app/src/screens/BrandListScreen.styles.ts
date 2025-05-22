import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    textAlign: 'center',
  },
  listContentContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16, // Increased horizontal padding for equal margins
  },
  // New styles for grid layout
  columnWrapper: {
    justifyContent: 'space-between',
    marginHorizontal: 0, // Reset any horizontal margins
  },
  cardContainer: {
    // Individual card wrapper if needed for additional styling
  },
});

export default styles;
