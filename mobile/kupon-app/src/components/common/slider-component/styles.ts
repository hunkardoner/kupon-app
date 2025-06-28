import { StyleSheet } from 'react-native';
import COLORS from '../../../constants/colors';

export const createStyles = (width: number) => StyleSheet.create({
  container: {
    height: 200,
    marginBottom: 16,
  },
  sliderList: {
    height: '100%',
  },
  slide: {
    width: width,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 4,
  },
});
