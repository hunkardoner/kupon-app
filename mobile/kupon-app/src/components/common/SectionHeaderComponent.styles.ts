import { StyleSheet } from 'react-native';
import COLORS from '../../constants/colors'; // Sabit renklerimize göre yolu ayarlayın

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    // Arka plan rengini isteğe bağlı olarak ayarlayabilirsiniz
    // backgroundColor: COLORS.background, 
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default styles;
