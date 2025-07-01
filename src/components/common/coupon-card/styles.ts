import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  couponCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    minHeight: 100,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  logoContainer: {
    position: 'relative',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandLogo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: 24,
    flexDirection: 'column',
    gap: 2,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadge: {
    backgroundColor: '#4CAF50',
  },
  expiringSoonBadge: {
    backgroundColor: '#f44336',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  couponTitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  discountLabel: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validityText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
});
