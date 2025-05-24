<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\CouponCode;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function index(Request $request)
    {
        $query = CouponCode::where('is_active', true)
            ->where(function($q) {
                $q->where('end_date', '>=', now())
                  ->orWhereNull('end_date');
            })
            ->with(['brand', 'categories']);

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->whereHas('categories', function($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by brand
        if ($request->has('brand') && $request->brand) {
            $query->whereHas('brand', function($q) use ($request) {
                $q->where('slug', $request->brand);
            });
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('brand', function($brandQuery) use ($search) {
                      $brandQuery->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('categories', function($catQuery) use ($search) {
                      $catQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $couponCodes = $query->latest()->paginate(12);
        
        // Get filter options
        $categories = Category::orderBy('name')->get();
        $brands = Brand::where('is_active', true)->orderBy('name')->get();

        return view('frontend.coupons.index', compact('couponCodes', 'categories', 'brands'));
    }

    public function show($id)
    {
        $coupon = CouponCode::where('id', $id)
            ->where('is_active', true)
            ->with(['brand', 'categories'])
            ->firstOrFail();

        // Get related coupons
        $relatedCoupons = CouponCode::where('is_active', true)
            ->where('id', '!=', $coupon->id)
            ->where(function($query) {
                $query->where('end_date', '>=', now())
                      ->orWhereNull('end_date');
            });

        // First try to get coupons from same brand
        if ($coupon->brand_id) {
            $relatedCoupons = $relatedCoupons->where('brand_id', $coupon->brand_id);
        }

        $relatedCoupons = $relatedCoupons->with('brand')->latest()->take(4)->get();

        // If no brand-related coupons, get from same categories
        if ($relatedCoupons->count() < 4 && $coupon->categories->count() > 0) {
            $categoryIds = $coupon->categories->pluck('id');
            $additionalCoupons = CouponCode::where('is_active', true)
                ->where('id', '!=', $coupon->id)
                ->where(function($query) {
                    $query->where('end_date', '>=', now())
                          ->orWhereNull('end_date');
                })
                ->whereHas('categories', function($q) use ($categoryIds) {
                    $q->whereIn('categories.id', $categoryIds);
                })
                ->with('brand')
                ->latest()
                ->take(4 - $relatedCoupons->count())
                ->get();

            $relatedCoupons = $relatedCoupons->concat($additionalCoupons);
        }

        return view('frontend.coupons.show', compact('coupon', 'relatedCoupons'));
    }
}
