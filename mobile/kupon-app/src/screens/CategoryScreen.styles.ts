import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const createStyles = (width: number) => {
  // Calculate image height based on screen width, e.g., for a 16:9 aspect ratio or similar
  // Or a fixed proportion of screen height if preferred.
  // For simplicity, let's make it a bit responsive to width.
  const imageDynamicHeight = width * 0.5; // Adjust ratio as needed, e.g., 0.5 for a 2:1 width:height

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      color: COLORS.error,
      fontSize: 16,
      textAlign: 'center',
      marginHorizontal: 20,
    },
    headerContainer: {
      backgroundColor: COLORS.white,
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    categoryImage: {
      width: '100%',
      height: imageDynamicHeight, // Use dynamic height
      borderRadius: 8,
      marginBottom: 16,
    },
    headerTextContainer: {
      marginTop: 8,
    },
    categoryTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.text,
      marginBottom: 8,
    },
    categoryDescription: {
      fontSize: 16,
      color: COLORS.textSecondary,
      lineHeight: 22,
    },
    couponsSection: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.text,
      marginBottom: 16,
    },
    couponCard: {
      marginBottom: 12,
      backgroundColor: COLORS.white,
      borderRadius: 8,
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      // CardComponent itself is responsive, so specific width/height here might not be needed
      // unless overriding CardComponent's internal responsive sizing for this specific screen.
    },
    noCouponsContainer: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    noCouponsText: {
      fontSize: 16,
      color: COLORS.textSecondary,
    },
  });
};

export default createStyles;
