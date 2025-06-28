import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  alphabetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  letterButton: {
    width: '14.28%', // 7 columns
    aspectRatio: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedLetter: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  letterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedLetterText: {
    color: '#fff',
  },
  bottomSpacer: {
    height: 20,
  },
});
