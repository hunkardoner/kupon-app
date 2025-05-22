import { StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const styles = StyleSheet.create({
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
  card: {
    flex: 1,
    margin: 8,
    maxWidth: '45%', // Her sütunda 2 kart olacak şekilde
  },
  listContent: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  }
});

export default styles;
