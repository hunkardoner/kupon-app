import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16, // Yatayda boşluk
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  touchable: {
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 4,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  contentContainer: {
    // If there's no image, we might want different padding or alignment
  },
});

export default styles;
