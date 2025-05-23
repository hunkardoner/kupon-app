import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

export const couponScreenStyles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center', // İçeriği ortala
  },
  brandLogo: {
    width: 150,
    height: 75,
    marginBottom: 15,
  },
  brandName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  couponCodeLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 15,
  },
  couponCode: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary, // Changed from colors.accent
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.border, // Changed from colors.lightGray
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  detailValue: {
    fontSize: 16,
    color: colors.textSecondary,
    flexShrink: 1, // Allow text to shrink if needed
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flex: 1, // Take remaining space
    marginLeft: 8, // Add some space between label and tags
  },
  categoryTag: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
    fontSize: 12,
  },
});
