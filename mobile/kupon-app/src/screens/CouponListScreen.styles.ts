import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const createStyles = (width: number) => {
  // Determine number of columns based on screen width
  // For example, 1 column for very narrow screens, 2 for wider ones
  const numColumns = width < 600 ? 2 : 3; // Adjust threshold as needed

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    title: {
      fontSize: 22, // AppNavigator ile tutarlı olması için isteğe bağlı
      fontWeight: 'bold',
      color: COLORS.text,
      paddingHorizontal: 16,
      paddingTop: 10, // Eğer header yoksa veya ek başlık isteniyorsa
      paddingBottom: 10,
    },
    centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20, // İçerik için padding
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
      paddingVertical: 8, // Liste içeriği için dikey boşluk
      paddingHorizontal: 16, // Increased horizontal padding for equal margins
    },
    columnWrapper: {
      justifyContent: 'space-between', // Even spacing between items
    },
    cardContainer: {
      // Individual card wrapper if needed for additional styling
      // marginBottom: 16, // Add margin to the bottom of each card container if numColumns is 1
    },
  });

  return { styles, numColumns }; // Return styles and numColumns separately
};

export default createStyles;
