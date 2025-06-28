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
  },
  couponImageContainer: {
    position: 'relative',
    backgroundColor: '#f8f9fa',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  couponImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'column',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
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
  couponContent: {
    padding: 16,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  discountBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  discountLabel: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
  couponFooter: {
    marginBottom: 12,
  },
  validityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  validityText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  actionContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  viewButtonText: {
    color: '#007bff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  usageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  usageText: {
    fontSize: 12,
    color: '#2196F3',
    marginLeft: 4,
    fontWeight: '500',
  },
});
