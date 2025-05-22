import { StyleSheet, Dimensions } from 'react-native';
import COLORS from '../../constants/colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: 200, // Slider yüksekliği, ihtiyaca göre ayarlayın
    marginBottom: 16,
  },
  sliderList: {
    height: '100%',
  },
  slide: {
    width: width, // Her bir slide ekran genişliğinde olacak
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // Added back: for absolute positioning of children
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute', // Added: to position within the slide container
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  textContainer: {
    position: 'absolute',
    bottom: 10, // Metinlerin alttan mesafesi
    left: 10, // Metinlerin soldan mesafesi
    right: 10, // Metinlerin sağdan mesafesi
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Metin arka planı (hafif transparan)
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

export default styles;
