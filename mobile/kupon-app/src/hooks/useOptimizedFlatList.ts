// src/hooks/useOptimizedFlatList.ts
import { useMemo, useCallback } from 'react';
import { ListRenderItem } from 'react-native';

interface OptimizedFlatListConfig<T> {
  data: T[] | undefined;
  renderItem: (item: T, index: number) => React.ReactElement;
  keyExtractor?: (item: T, index: number) => string;
  maxToRenderPerBatch?: number;
  windowSize?: number;
  removeClippedSubviews?: boolean;
  updateCellsBatchingPeriod?: number;
}

export const useOptimizedFlatList = <T extends { id: number | string }>({
  data,
  renderItem,
  keyExtractor,
  maxToRenderPerBatch = 10,
  windowSize = 10,
  removeClippedSubviews = true,
  updateCellsBatchingPeriod = 50,
}: OptimizedFlatListConfig<T>) => {
  // Memoized render item function
  const memoizedRenderItem: ListRenderItem<T> = useCallback(
    ({ item, index }) => renderItem(item, index),
    [renderItem]
  );

  // Memoized key extractor
  const memoizedKeyExtractor = useCallback(
    (item: T, index: number) => {
      if (keyExtractor) {
        return keyExtractor(item, index);
      }
      return item.id.toString();
    },
    [keyExtractor]
  );

  // Memoized performance props
  const performanceProps = useMemo(
    () => ({
      maxToRenderPerBatch,
      windowSize,
      removeClippedSubviews,
      updateCellsBatchingPeriod,
      // Disable scroll optimization on Android if needed
      disableVirtualization: false,
      // Use native driver for better performance
      scrollEventThrottle: 16,
    }),
    [maxToRenderPerBatch, windowSize, removeClippedSubviews, updateCellsBatchingPeriod]
  );

  return {
    data: data || [],
    renderItem: memoizedRenderItem,
    keyExtractor: memoizedKeyExtractor,
    ...performanceProps,
  };
};

// Custom hook for responsive grid calculations
export const useResponsiveGrid = (containerWidth: number, minItemWidth: number = 150) => {
  return useMemo(() => {
    const padding = 16; // Default padding
    const availableWidth = containerWidth - padding * 2;
    const numColumns = Math.floor(availableWidth / minItemWidth);
    const actualNumColumns = Math.max(1, numColumns);
    const itemWidth = (availableWidth - (actualNumColumns - 1) * 16) / actualNumColumns;
    
    return {
      numColumns: actualNumColumns,
      itemWidth,
      spacing: 16,
    };
  }, [containerWidth, minItemWidth]);
};
