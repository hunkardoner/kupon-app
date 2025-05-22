import { StyleSheet, Dimensions } from 'react-native';
import COLORS from '../../constants/colors';

// Calculate card width based on screen width (2 cards per row with margin)
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2; // 48 = 16*3 (left margin + middle margin + right margin)

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 8, // Reduced horizontal margin for grid layout
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: cardWidth,
    height: 200, // Fixed height for consistency
  },
  touchable: {
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: 120, // Fixed height for images
    borderRadius: 4,
    marginBottom: 12,
    resizeMode: 'contain', // Changed to 'contain' to maintain aspect ratio without distortion
  },
  placeholderImage: {
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxHeight: 32, // Limit subtitle to 2 lines max
  },
  contentContainer: {
    alignItems: 'center', // Center content horizontally
    justifyContent: 'flex-start',
    flex: 1,
  },
});

export default styles;
