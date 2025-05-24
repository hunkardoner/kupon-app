// src/hooks/useQueries.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
  fetchCategories,
  fetchCategoryById,
  fetchBrands,
  fetchBrandById,
  fetchCouponCodes,
  fetchCouponCodeById,
  fetchSliders,
} from '../api';
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
    queryFn: fetchCategories,
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
    queryFn: () => fetchCategoryById(id),
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
    queryFn: () => fetchBrands(params),
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
    queryFn: () => fetchBrandById(id),
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
    queryFn: () => fetchCouponCodes(params),
    staleTime: 2 * 60 * 1000, // 2 dakika - kuponlar daha sık güncellenebilir
    ...options,
  });
};

export const useCoupon = (
  id: number,
  options?: Omit<UseQueryOptions<Coupon, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.coupon(id),
    queryFn: () => fetchCouponCodeById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    ...options,
  });
};

// Popular Content Hooks
export const usePopularCoupons = (
  options?: Omit<UseQueryOptions<Coupon[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.popularCoupons,
    queryFn: () => fetchCouponCodes({ limit: 5, popular: true }),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const usePopularBrands = (
  options?: Omit<UseQueryOptions<Brand[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: queryKeys.popularBrands,
    queryFn: () => fetchBrands({ limit: 6, popular: true }),
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
    queryFn: () => fetchCouponCodes({ brand_id: brandId }),
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
    queryFn: fetchSliders,
    staleTime: 15 * 60 * 1000, // 15 dakika - slider'lar çok nadir değişir
    ...options,
  });
};
