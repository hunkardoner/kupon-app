import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useState, useEffect } from 'react';

// Temporary inline service for recommendations
const recommendationService = {
  async getPersonalizedCoupons(userId: string, preferences: any) {
    // Mock implementation
    return { 
      success: true, 
      data: {
        coupons: [],
        categories: [],
        trending: []
      }
    };
  },

  async trackUserAction(action: any) {
    // Mock implementation
    return { success: true };
  },

  async getRecommendations() {
    // Mock implementation
    return { success: true, data: [] };
  },

  async trackCategoryView(categoryId: string, timeSpent: number) {
    // Mock implementation
    return { success: true };
  },

  async trackSearch(searchTerm: string) {
    // Mock implementation
    return { success: true };
  },

  async trackCouponUsage(couponId: string) {
    // Mock implementation
    return { success: true };
  },

  async getPersonalizedRecommendations(userId: string) {
    // Mock implementation
    return { success: true, data: [] };
  },

  async getPopularRecommendations() {
    // Mock implementation
    return { success: true, data: [] };
  },
};

export interface PersonalizedCoupon {
  id: number;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  valid_from: string;
  valid_to: string;
  usage_limit?: number | null;
  usage_count: number;
  is_active: boolean;
  brand_id: number;
  campaign_url?: string | null;
  campaign_title?: string | null;
  brand?: {
    id: number;
    name: string;
    logo?: string | null;
  };
  categories?: Array<{
    id: number;
    name: string;
  }>;
  created_at: string;
  updated_at: string;
  // Personalization specific fields
  relevanceScore: number;
  reason: string;
}

export interface UserBehavior {
  viewedCategories: Record<string, number>;
  searchHistory: string[];
  usedCoupons: string[];
  timeSpentPerCategory: Record<string, number>;
  lastActivityDate: Date;
}

export function usePersonalization() {
  const { user, isAuthenticated } = useAuth();
  const { favorites } = useFavorites();
  const [personalizedCoupons, setPersonalizedCoupons] = useState<PersonalizedCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userBehavior, setUserBehavior] = useState<UserBehavior | null>(null);

  // Track category view
  const trackCategoryView = async (categoryId: string, timeSpent: number = 0) => {
    try {
      if (isAuthenticated) {
        await recommendationService.trackCategoryView(categoryId, timeSpent);
      }
      
      // Update local behavior tracking
      setUserBehavior(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          viewedCategories: {
            ...prev.viewedCategories,
            [categoryId]: (prev.viewedCategories[categoryId] || 0) + 1,
          },
          timeSpentPerCategory: {
            ...prev.timeSpentPerCategory,
            [categoryId]: (prev.timeSpentPerCategory[categoryId] || 0) + timeSpent,
          },
          lastActivityDate: new Date(),
        };
      });
    } catch (error) {
      console.error('Error tracking category view:', error);
    }
  };

  // Track search
  const trackSearch = async (searchTerm: string) => {
    try {
      if (isAuthenticated) {
        await recommendationService.trackSearch(searchTerm);
      }
      
      // Update local behavior tracking
      setUserBehavior(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          searchHistory: [searchTerm, ...prev.searchHistory.slice(0, 19)], // Keep last 20 searches
          lastActivityDate: new Date(),
        };
      });
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  };

  // Track coupon usage
  const trackCouponUsage = async (couponId: string) => {
    try {
      if (isAuthenticated) {
        await recommendationService.trackCouponUsage(couponId);
      }
      
      // Update local behavior tracking
      setUserBehavior(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          usedCoupons: [couponId, ...prev.usedCoupons],
          lastActivityDate: new Date(),
        };
      });
    } catch (error) {
      console.error('Error tracking coupon usage:', error);
    }
  };

  // Generate personalized recommendations
  const generateRecommendations = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      let recommendations: PersonalizedCoupon[] = [];

      if (isAuthenticated && user) {
        // Get server-side personalized recommendations
        const response = await recommendationService.getPersonalizedRecommendations(user.id.toString());
        if (response.success) {
          recommendations = response.data || [];
        }
      } else {
        // Get popular recommendations for anonymous users
        const response = await recommendationService.getPopularRecommendations();
        if (response.success) {
          recommendations = response.data || [];
        }
      }

      // Apply local personalization based on behavior
      if (userBehavior) {
        recommendations = applyLocalPersonalization(recommendations, userBehavior);
      }

      setPersonalizedCoupons(recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply local personalization logic
  const applyLocalPersonalization = (
    coupons: PersonalizedCoupon[],
    behavior: UserBehavior
  ): PersonalizedCoupon[] => {
    return coupons
      .map(coupon => {
        let relevanceScore = coupon.relevanceScore || 0;
        let reason = coupon.reason || '';

        // Boost score based on viewed categories
        const categoryName = coupon.categories?.[0]?.name || 'Genel';
        const categoryViews = behavior.viewedCategories[categoryName] || 0;
        if (categoryViews > 0) {
          relevanceScore += Math.min(categoryViews * 0.1, 0.5);
          reason = `${categoryName} kategorisinde aktifsiniz`;
        }

        // Boost score based on search history
        const searchMatch = behavior.searchHistory.some(search =>
          coupon.description.toLowerCase().includes(search.toLowerCase()) ||
          coupon.brand?.name?.toLowerCase().includes(search.toLowerCase())
        );
        if (searchMatch) {
          relevanceScore += 0.3;
          reason = 'Arama geçmişinize uygun';
        }

        // Boost score for favorite brands
        if (favorites.includes(coupon.id.toString())) {
          relevanceScore += 0.2;
          reason = 'Favori markanızdan';
        }

        return {
          ...coupon,
          relevanceScore,
          reason,
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  // Initialize user behavior tracking
  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize with user preferences
      setUserBehavior({
        viewedCategories: {},
        searchHistory: [],
        usedCoupons: [],
        timeSpentPerCategory: {},
        lastActivityDate: new Date(),
      });
    }
  }, [isAuthenticated, user]);

  // Generate recommendations when auth state or favorites change
  useEffect(() => {
    generateRecommendations();
  }, [isAuthenticated, user, favorites]);

  return {
    personalizedCoupons,
    isLoading,
    userBehavior,
    trackCategoryView,
    trackSearch,
    trackCouponUsage,
    generateRecommendations,
  };
}
