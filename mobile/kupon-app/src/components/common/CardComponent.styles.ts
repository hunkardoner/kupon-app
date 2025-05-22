import { StyleSheet, useWindowDimensions } from 'react-native';
import COLORS from '../../constants/colors';

// Function to create styles dynamically based on window dimensions
const createStyles = (width: number) => {
  // Adjusted calculation: Screen width - (outside padding left + outside padding right + space between cards)
  const cardWidth = (width - (16 + 16 + 16)) / 2; // 16 padding on left/right edges + 16 between cards
  // For horizontal lists we use a fixed width that's slightly narrower to give visual separation
  const horizontalCardWidth = width * 0.38; // Approximately 38% of screen width

  return StyleSheet.create({
    container: {
      backgroundColor: COLORS.card,
      borderRadius: 8,
      padding: 12,
      marginVertical: 8,
      marginHorizontal: 0, // Remove horizontal margin from card itself as container handles this
      shadowColor: COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      width: cardWidth, // Default width for grid view
      height: 200, // Fixed height for consistency
    },
    horizontalContainer: {
      width: horizontalCardWidth, // Use the narrower width for horizontal lists
      marginHorizontal: 0, // Remove any horizontal margin
      height: 190, // Slightly smaller height for horizontal lists
    },
    touchable: {
      borderRadius: 8,
      width: cardWidth, // Ensure touchable has same width as container
    },
    horizontalTouchable: {
      width: horizontalCardWidth,
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
};

export default createStyles;
