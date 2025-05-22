import { StyleSheet } from 'react-native';
import Colors from '../constants/colors'; // Assuming you have a colors constant

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // Example color
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.primaryText, // Example color
  },
  brandName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.secondaryText, // Example color
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: Colors.tertiaryText, // Example color
    marginBottom: 15,
  },
  codeContainer: {
    backgroundColor: Colors.primary, // Example color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  codeLabel: {
    fontSize: 14,
    color: Colors.white, // Example color
    marginBottom: 4,
  },
  codeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white, // Example color
    letterSpacing: 1,
  },
  descriptionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
    color: Colors.primaryText,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.secondaryText,
    marginBottom: 15,
  },
  termsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
    color: Colors.primaryText,
  },
  terms: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.tertiaryText,
    marginBottom: 15,
  },
  expiresText: {
    fontSize: 14,
    color: Colors.accent,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
