import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const createStyles = (width: number) => {
  // width parametresi ileride kullanılmak üzere eklendi, 
  // şimdilik mevcut stiller doğrudan kullanılıyor.
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    sectionContainer: {
      marginBottom: 20,
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    horizontalList: {
      paddingLeft: 16,
      paddingRight: 16,
      gap: 16,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    errorText: {
      color: COLORS.error,
      fontSize: 16,
      textAlign: 'center',
    },
  });
};

export default createStyles;
