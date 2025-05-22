import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const createStyles = (width: number) => {
  const numColumns = width < 600 ? 2 : 3; // Adjust threshold as needed

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
      paddingHorizontal: 16,
    },
    columnWrapper: {
      justifyContent: 'space-between',
      marginHorizontal: 0,
    },
    cardContainer: {
      // Individual card wrapper if needed for additional styling
    },
  });

  return { styles, numColumns };
};

export default createStyles;
