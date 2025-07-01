// src/hooks/useQueries.ts
import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { useMemo } from 'react';
import { dataAPI } from '../api';
import { Category, Brand, Coupon, Slider } from '../types';

// Query Keys - Centralized key management
export const queryKeys = {
  categories: ['categories'] as const,
  category: (id: number) => ['category', id] as const,
  brands: (params?: any) => ['brands', params] as const,
  brand: (id: number) => ['brand', id] as const,
  coupons: (params?: any) => ['coupons', params] as const,
  coupon: (id: number) => ['coupon', id] as const,
  popularCoupons: ['popularCoupons'] as const,
  popularBrands: ['popularBrands'] as const,
  sliders: ['sliders'] as const,
  brandCoupons: (brandId: number) => ['coupons', 'brand', brandId] as const,
};

// Categories Hooks
export const useCategories = (
  options?: Omit<UseQueryOptions<Category[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => dataAPI.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 dakika - kategoriler çok değişmez
    ...options,
  });
};

export const useCategory = (
  id: number,
  options?: Omit<UseQueryOptions<Category, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.category(id),
    queryFn: () => dataAPI.getCategory(id),
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
};

// Brands Hooks
export const useBrands = (
  params?: any,
  options?: Omit<UseQueryOptions<Brand[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.brands(params),
    queryFn: () => dataAPI.getBrands(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useBrand = (
  id: number,
  options?: Omit<UseQueryOptions<Brand, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.brand(id),
    queryFn: () => dataAPI.getBrand(id),
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
};

// Coupons Hooks
export const useCoupons = (
  params?: any,
  options?: Omit<UseQueryOptions<Coupon[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.coupons(params),
    queryFn: () => dataAPI.getCoupons(params),
    staleTime: 2 * 60 * 1000, // 2 dakika - kuponlar daha sık güncellenebilir
    ...options,
  });
};

// Infinite scroll için yeni hook
export const useInfiniteCoupons = (
  params?: any,
  options?: Omit<UseInfiniteQueryOptions<any, Error>, 'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'>
) => {
  return useInfiniteQuery({
    queryKey: ['coupons', 'infinite', params],
    queryFn: ({ pageParam = 1 }) => {
      console.log('Fetching page:', pageParam, 'with params:', params);
      const queryParams = {
        ...params,
        page: pageParam,
        per_page: params?.per_page || 15 // Backend default, kullanıcı özelleştirebilir
      };
      return dataAPI.getCoupons(queryParams);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      console.log('getNextPageParam called with:', { 
        currentPage: lastPage?.meta?.current_page,
        lastPage: lastPage?.meta?.last_page,
        totalPages: allPages.length,
        meta: lastPage?.meta 
      });
      
      // Backend meta bilgisini kullan
      if (lastPage?.meta) {
        const { current_page, last_page } = lastPage.meta;
        if (current_page < last_page) {
          const nextPage = current_page + 1;
          console.log('Next page will be:', nextPage);
          return nextPage;
        }
      }
      
      console.log('No more pages available');
      return undefined;
    },
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useCoupon = (
  id: number,
  options?: Omit<UseQueryOptions<Coupon, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.coupon(id),
    queryFn: () => dataAPI.getCoupon(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
};

// Popular Content Hooks with memoization
export const usePopularCoupons = (
  options?: Omit<UseQueryOptions<Coupon[], Error>, 'queryKey' | 'queryFn'>
) => {
  const queryKey = useMemo(() => queryKeys.popularCoupons, []);
  const queryFn = useMemo(() => () => dataAPI.getCoupons({ limit: 5, popular: true }), []);
  
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const usePopularBrands = (
  options?: Omit<UseQueryOptions<Brand[], Error>, 'queryKey' | 'queryFn'>
) => {
  const queryKey = useMemo(() => queryKeys.popularBrands, []);
  const queryFn = useMemo(() => () => dataAPI.getBrands({ limit: 6, popular: true }), []);
  
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

// Brand specific coupons
export const useBrandCoupons = (
  brandId: number,
  options?: Omit<UseQueryOptions<Coupon[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.brandCoupons(brandId),
    queryFn: () => dataAPI.getCoupons({ brand_id: brandId }),
    staleTime: 5 * 60 * 1000,
    enabled: !!brandId,
    ...options,
  });
};

// Sliders Hook
export const useSliders = (
  options?: Omit<UseQueryOptions<Slider[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.sliders,
    queryFn: () => dataAPI.getSliders(),
    staleTime: 15 * 60 * 1000, // 15 dakika - slider'lar çok nadir değişir
    ...options,
  });
};
