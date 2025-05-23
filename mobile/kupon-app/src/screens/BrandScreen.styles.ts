// src/screens/BrandScreen.styles.ts
import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import colors from '../constants/colors';

// Define createStyles function
export const createStyles = (width: number) => {
  const numColumns = width < 600 ? 2 : 3; // Example: 2 columns for smaller screens, 3 for wider
  const logoSize = width * 0.3; // Example: logo width as 30% of screen width
  const logoHeight = logoSize * 0.5; // Example: maintain a 2:1 aspect ratio for the logo

  const styles = {
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    } as ViewStyle,
    container: {
      flex: 1,
      backgroundColor: colors.background,
    } as ViewStyle,
    headerContainer: {
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    } as ViewStyle,
    listHeaderStyle: {
      marginBottom: 0,
      zIndex: 1,
    } as ViewStyle,
    brandLogo: {
      width: logoSize, // Dynamic width
      height: logoHeight, // Dynamic height
      marginBottom: 15,
    } as ImageStyle,
    brandName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 8,
      textAlign: 'center',
    } as TextStyle,
    brandDescription: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 12,
      paddingHorizontal: 10,
    } as TextStyle,
    websiteLink: {
      fontSize: 16,
      color: colors.secondary,
      fontWeight: '600',
      marginBottom: 10,
      textDecorationLine: 'underline',
    } as TextStyle,
    couponsHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background,
      marginBottom: 8,
    } as TextStyle,
    listContentContainer: {
      paddingBottom: 10,
      paddingHorizontal: 16,
    } as ViewStyle,
    cardWrapper: {
      marginBottom: 10,
    } as ViewStyle,
    columnWrapper: {
      justifyContent: 'space-between',
      marginHorizontal: 0,
    } as ViewStyle,
    emptyCouponsContainer: {
      padding: 20,
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    } as ViewStyle,
    noCouponsText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      color: colors.textSecondary,
    } as TextStyle,
    errorText: {
      fontSize: 16,
      color: colors.error,
      textAlign: 'center',
      padding: 20,
    } as TextStyle,
  };
  return { styles, numColumns };
};
