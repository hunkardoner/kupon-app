<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\CouponCode;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->get('q');
        
        if (!$query) {
            return redirect()->route('home');
        }

        // Initialize with empty collections to avoid errors
        $coupons = collect([]);
        $brands = collect([]);
        $categories = collect([]);
        
        try {
            // Search in coupons - simplified query
            $coupons = CouponCode::where('is_active', true)
                ->where(function($q) use ($query) {
                    $q->where('title', 'like', "%{$query}%")
                      ->orWhere('description', 'like', "%{$query}%")
                      ->orWhere('code', 'like', "%{$query}%");
                })
                ->with('brand')
                ->latest()
                ->take(10)
                ->get();
        } catch (\Exception $e) {
            \Log::error('Coupon search error: ' . $e->getMessage());
        }

        try {
            // Search in brands
            $brands = Brand::where('is_active', true)
                ->where('name', 'like', "%{$query}%")
                ->withCount('couponCodes')
                ->orderBy('name')
                ->take(5)
                ->get();
        } catch (\Exception $e) {
            \Log::error('Brand search error: ' . $e->getMessage());
        }

        try {
            // Search in categories
            $categories = Category::where('name', 'like', "%{$query}%")
                ->withCount('couponCodes')
                ->orderBy('name')
                ->take(5)
                ->get();
        } catch (\Exception $e) {
            \Log::error('Category search error: ' . $e->getMessage());
        }

        $totalResults = $coupons->count() + $brands->count() + $categories->count();

        return view('frontend.search.index', compact('query', 'coupons', 'brands', 'categories', 'totalResults'));
    }

    public function suggestions(Request $request)
    {
        $query = $request->get('q');
        
        if (!$query || strlen($query) < 2) {
            return response()->json([]);
        }

        $suggestions = [];

        // Get coupon suggestions
        $coupons = CouponCode::where('is_active', true)
            ->where(function($q) {
                $q->where('end_date', '>=', now())
                  ->orWhereNull('end_date');
            })
            ->where(function($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('code', 'like', "%{$query}%");
            })
            ->with('brand')
            ->latest()
            ->take(5)
            ->get();

        foreach ($coupons as $coupon) {
            $suggestions[] = [
                'type' => 'coupon',
                'title' => $coupon->title,
                'subtitle' => $coupon->brand ? $coupon->brand->name : null,
                'url' => route('coupons.show', $coupon->id),
                'icon' => 'fas fa-ticket-alt'
            ];
        }

        // Get brand suggestions
        $brands = Brand::where('is_active', true)
            ->where('name', 'like', "%{$query}%")
            ->orderBy('name')
            ->take(3)
            ->get();

        foreach ($brands as $brand) {
            $suggestions[] = [
                'type' => 'brand',
                'title' => $brand->name,
                'subtitle' => 'Marka',
                'url' => route('brands.show', $brand->slug),
                'icon' => 'fas fa-store'
            ];
        }

        // Get category suggestions
        $categories = Category::where('name', 'like', "%{$query}%")
            ->orderBy('name')
            ->take(3)
            ->get();

        foreach ($categories as $category) {
            $suggestions[] = [
                'type' => 'category',
                'title' => $category->name,
                'subtitle' => 'Kategori',
                'url' => route('categories.show', $category->slug),
                'icon' => 'fas fa-tags'
            ];
        }

        return response()->json($suggestions);
    }
}
